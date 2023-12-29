const terraform = require('../terraform/terraformapi.js');
const { execSync, exec } = require('child_process');
const util = require('util');
const execProm = util.promisify(exec);
const k8 = require('../kubernetes/kubernetesapi.js');

const deploymentController = {};

deploymentController.addVPC = (req, res, next) => {
  const {
    provider,
    name,
    vpcRegion,
    userId,
    projectId,
    projectName,
    awsAccessKey,
    awsSecretKey,
  } = req.body;
  const cleanName = name.replace(/[^A-Z0-9]/gi, '_').toLowerCase();

  // create a user and project  directory
  terraform.initializeUser(userId);
  terraform.initializeProject(userId, projectId);

  // Connect AWS credentials to Terraform state, then provision the VPC
  terraform
    .connectToProvider(
      userId,
      projectId,
      provider,
      vpcRegion,
      awsAccessKey,
      awsSecretKey
    )
    .then(() => {
      console.log('Successfully connected to provider');
      terraform
        .addVPC(userId, projectId, provider, projectName)
        .then((externalId) => {
          console.log('Successfully provisioned VPC with id:', externalId);
          res.locals.data = { externalId }; // VPC ID
          return next();
        })
        .catch(() => {
          console.log('error with addVPC');
        });
    })
    .catch((err) => {
      const errObj = {
        log: 'Error in deploymentController.addProject:' + err,
        message: { err: 'An error occured trying to create a VPC' },
      };
      return next(errObj);
    });
};

deploymentController.deleteVPC = (req, res, next) => {
  // const { externalId } = req.body;
  // const { accessKey, secretKey } = req.body.cloudProviders[provider];
  const { userId, projectId } = req.body.ids;
  const { clusterIds } = req.body; // an array of the clusterIds that are active in this project

  const promises = [];

  clusterIds.forEach((clusterId) => {
    console.log('Destroying cluster', clusterId);
    promises.push(terraform.destroyCluster(userId, projectId, clusterId));
  });

  Promise.all(promises)
    .then((outputs) => {
      console.log('Completed destoying all clusters within project', outputs);
      console.log('Now deleting VPC');
      terraform
        .destroyVPC(userId, projectId)
        .then((output) => {
          console.log(output);
          return next();
        })
        .catch((err) => {
          const errObj = {
            log: 'Error in deploymentController.deleteProject:' + err,
            message: { err: 'An error occured trying to delete a VPC' },
          };
          return next(errObj);
        });
    })
    .catch((err) => {
      console.log(
        'Failed to destroy all clusters. Can not complete deletion of project',
        err
      );
    });
};

deploymentController.addCluster = (req, res, next) => {
  console.log('entered addCluster in deploymentController');
  console.log('req.body:', req.body);
  const {
    userId,
    projectId,
    externalId,
    name,
    instanceType,
    minNodes,
    maxNodes,
    desiredNodes,
  } = req.body;
  const cleanName = name.replace(/[^A-Z0-9]/gi, '_').toLowerCase();
  console.log('cleanName:', cleanName);
  terraform
    .addCluster(
      userId,
      projectId,
      cleanName,
      externalId,
      minNodes,
      maxNodes,
      desiredNodes,
      instanceType
    )
    .then(() => {
      console.log('getting efsId');
      const volumeHandle = terraform.getEFSId(userId, projectId, cleanName);
      console.log('efsId:', volumeHandle);
      res.locals.data = { volumeHandle };
      return next();
    })
    .catch((err) => {
      const errObj = {
        log: 'Error in deploymentController.addCluster:' + err,
        message: { err: 'An error occured trying to create a cluster' },
      };
      return next(errObj);
    });
};

deploymentController.deleteCluster = (req, res, next) => {
  // const { provider } = req.body;
  // const { accessKey, secretKey } = req.body.cloudProviders[provider];
  const { userId, projectId, clusterName } = req.body.ids;

  terraform.destroyCluster(userId, projectId, clusterName);

  return next();
};

deploymentController.configureCluster = async (req, res, next) => {
  const { vpcRegion, awsAccessKey, awsSecretKey, clusterName, yaml } = req.body;
  console.log(
    'Configuring cluster...',
    vpcRegion,
    awsAccessKey,
    awsSecretKey,
    clusterName,
    yaml
  );
  k8.connectCLtoAWS(awsAccessKey, awsSecretKey, vpcRegion);
  k8.connectKubectltoEKS = (vpcRegion, clusterName);
  k8.deploy(yaml);

  return next();
};

// Dockerize github repo and push to AWS ECR
deploymentController.build = async (req, res, next) => {
  const { repo, branch, awsAccessKey, awsSecretKey, vpcRegion } = req.body;
  const awsRepo = repo.split('/').join('-').toLowerCase(); // format: "githubUser-repoName"
  const imageName = repo.split('/').join('-').toLowerCase() + `-${branch}`; // format: "githubUser-repoName-branch"

  console.log(
    'in build controller. Credentials:',
    awsAccessKey,
    awsSecretKey,
    vpcRegion
  );

  // Sign in to AWS

  execSync(
    `aws --profile default configure set aws_access_key_id ${awsAccessKey}`
  );
  execSync(
    `aws --profile default configure set aws_secret_access_key ${awsSecretKey}`
  );
  execSync(`aws --profile default configure set region ${vpcRegion}`);

  // Get AWS Account ID
  const awsAccountIdRaw = execSync(`aws sts get-caller-identity`, {
    encoding: 'utf8',
  });
  const parsedAwsAccountId = JSON.parse(awsAccountIdRaw);
  const awsAccountId = parsedAwsAccountId.Account;

  // Create ECR repository
  const ecrUrl = `${awsAccountId}.dkr.ecr.${vpcRegion}.amazonaws.com`;
  execSync(
    `aws ecr get-login-password --region ${vpcRegion} | docker login --username AWS --password-stdin ${ecrUrl}`
  );
  await execProm(
    `aws ecr create-repository --repository-name ${awsRepo} --region ${vpcRegion} || true`
  );

  // Dockerize and push image to ECR repository
  const cloneUrl = `https://github.com/${repo}.git#${branch}`;
  const imageUrl = `${ecrUrl}/${awsRepo}`;
  await execProm(
    `docker buildx build --platform linux/amd64 -t ${imageName} ${cloneUrl} --load`
  );
  await execProm(`docker tag ${imageName} ${imageUrl}`);
  await execProm(`docker push ${imageUrl}`);

  res.locals.data = { imageName: imageUrl, imageTag: 'latest' };
  return next();
};

deploymentController.destroyImage = async (req, res, next) => {
  const { awsAccessKey, awsSecretKey, vpcRegion, repo, imageName, imageTag } =
    req.body;
  const awsRepo = repo.split('/').join('-').toLowerCase(); // format: "githubUser-repoName"

  // Sign in to AWS
  execSync(
    `aws --profile default configure set aws_access_key_id ${awsAccessKey}`
  );
  execSync(
    `aws --profile default configure set aws_secret_access_key ${awsSecretKey}`
  );
  execSync(`aws --profile default configure set region ${vpcRegion}`);

  // Delete image
  await execProm(
    `aws ecr batch-delete-image --repository-name ${awsRepo} --image-ids imageTag=${imageTag} --region ${vpcRegion}`
  );

  return next();
};

// Gets the public address of the ingress
deploymentController.getURL = (req, res, next) => {
  const { awsAccessKey, awsSecretKey, provider, vpcRegion } = req.body;
  const { clusterName } = req.body.ids;

  k8.connectCLtoAWS(awsAccessKey, awsSecretKey, vpcRegion);
  k8.connectKubectltoEKS = (vpcRegion, clusterName);

  // This function will keep calling itself until the address exists.
  // Once it does, it will put it on res.locals and call next();
  const checkURL = () => {
    console.log('Checking...');
    const address = k8.getUrl();
    console.log('Address:', address);
    if (address) {
      res.locals.address = address;
      return next();
    } else {
      setTimeout(checkURL, 100);
    }
  };

  checkURL();
};

module.exports = deploymentController;
