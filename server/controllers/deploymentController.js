const terraform = require('../terraform/terraformapi.js');
const { execSync, exec } = require('child_process');
const k8 = require('../kubernetes/kubernetesapi.js');

const deploymentController = {};

deploymentController.addProject = (req, res, next) => {
  const { provider, name, vpcRegion } = req.body;
  const { awsAccessKey, awsSecretKey } = req.body;
  const cleanName = name.replace(/[^A-Z0-9]/gi, '_').toLowerCase();

  // Connect AWS credentials to Terraform state, then provision the VPC
  terraform
    .connectToProvider(provider, vpcRegion, awsAccessKey, awsSecretKey)
    .then(() => {
      console.log('Successfully connected to provider');
      terraform.addVPC(vpcRegion, cleanName);
    })
    .then((externalId) => {
      console.log('Successfully provisioned VPC with id:', externalId);
      res.locals.data = { externalId }; // VPC ID
      return next();
    })
    .catch((err) => {
      const errObj = {
        log: 'Error in deploymentController.addProject:' + err,
        message: { err: 'An error occured trying to create a VPC' },
      };
      return next(errObj);
    });
};

deploymentController.deleteProject = (req, res, next) => {
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
  const { provider, vpcRegion, externalId } = req.body;
  const { awsAccessKey, awsSecretKey } = req.body;
  const { name, instanceType, minNodes, maxNodes, desiredNodes } =
    req.body.config;
  const cleanName = name.replace(/[^A-Z0-9]/gi, '_').toLowerCase();

  terraform
    .connectToProvider(provider, vpcRegion, awsAccessKey, awsSecretKey)
    .then(() => {
      terraform
        .addCluster(
          cleanName,
          externalId,
          minNodes,
          maxNodes,
          desiredNodes,
          instanceType
        )
        .then(() => {
          res.locals.data = {}; // Put a cluster ID here if needed ... may not need
          return next();
        })
        .catch((err) => {
          const errObj = {
            log: 'Error in deploymentController.addCluster:' + err,
            message: { err: 'An error occured trying to create a cluster' },
          };
          return next(errObj);
        });
    });
};

deploymentController.deleteCluster = (req, res, next) => {
  // const { provider } = req.body;
  // const { accessKey, secretKey } = req.body.cloudProviders[provider];
  const { userId, projectId, clusterId } = req.body.ids;

  terraform.destroyCluster(userId, projectId, clusterId);

  return next();
};

deploymentController.configureCluster = async (req, res, next) => {
  const { provider, vpcRegion } = req.body;
  const { awsAccessKey, awsSecretKey } = req.body;
  const { vpcId, clusterId } = req.body.ids;
  const { yamls } = req.body.yamls;
  // add command line function: apply yamls to cluster
  next();
};

// Dockerize github repo and push to AWS ECR
deploymentController.build = (req, res, next) => {
  const { repo, branch, awsAccessKey, awsSecretKey, vpcRegion } = req.body;
  const awsRepo = repo.split('/').join('-').toLowerCase(); // format: "githubUser-repoName"
  const imageName = repo.split('/').join('-').toLowerCase() + `-${branch}`; // format: "githubUser-repoName-branch"

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
  execSync(
    `aws ecr create-repository --repository-name ${awsRepo} --region ${vpcRegion} || true`
  );

  // Dockerize and push image to ECR repository
  const cloneUrl = `https://github.com/${repo}.git#${branch}`;
  const imageUrl = `${ecrUrl}/${awsRepo}`;
  execSync(`docker buildx build --platform linux/amd64 -t ${imageName} ${cloneUrl} --load`);
  execSync(`docker tag ${imageName} ${imageUrl}`);
  execSync(`docker push ${imageUrl}`);

  res.locals.data = { imageName: imageUrl, imageTag: 'latest' };
  return next();
};

deploymentController.destroyImage = (req, res, next) => {
  const { awsAccessKey, awsSecretKey } = req.body;
  const { vpcRegion } = req.body;
  const { repo, imageName, imageTag } = req.body;
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
  execSync(
    `aws ecr batch-delete-image --repository-name ${awsRepo} --image-ids imageTag=${imageTag} --region ${vpcRegion}`
  );
};

// Gets the public address of the ingress
deploymentController.getURL = (req, res, next) => {
  const { awsAccessKey, awsSecretKey } = req.body;
  const { provider, vpcRegion } = req.body;
  const { clusterId } = req.body.ids;

  k8.connectCLtoAWS(awsAccessKey, awsSecretKey, vpcRegion);
  k8.connectKubectltoEKS = (vpcRegion, clusterId);
  const address = k8.getURL();
  res.locals.address = address;
  return next();
};

module.exports = deploymentController;
