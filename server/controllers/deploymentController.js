const terraform = require('../terraform/terraformapi.js');
const { execSync, exec } = require('child_process');
const k8 = require('../kubernetes/kubernetesapi.js');

const deploymentController = {};

deploymentController.addProject = (req, res, next) => {
  const { provider, name, region } = req.body.config;
  const { accessKey, secretKey } = req.body.cloudProviders[provider];
  const cleanName = name.replace(/[^A-Z0-9]/gi, '_').toLowerCase();

  // Connect AWS credentials to Terraform state, then provision the VPC
  terraform
    .connectToProvider(provider, region, accessKey, secretKey)
    .then(() => {
      console.log('Successfully connected to provider');
      terraform.addVPC(region, cleanName);
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
  const { provider, region, externalId } = req.body;
  const { accessKey, secretKey } = req.body.cloudProviders[provider];
  const { name, instanceType, minNodes, maxNodes, desiredNodes } =
    req.body.config;
  const cleanName = name.replace(/[^A-Z0-9]/gi, '_').toLowerCase();

  terraform
    .connectToProvider(provider, region, accessKey, secretKey)
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
  const { provider, region } = req.body;
  const { accessKey, secretKey } = req.body.cloudProviders[provider];
  const { vpcId, clusterId } = req.body.ids;
  const { yamls } = req.body.yamls;
  // add command line function: apply yamls to cluster
  next();
};

// to build a github repo and add it to AWS ECR

deploymentController.build = (req, res, next) => {
  const { accessKey, secretKey } = req.body;
  const { region } = req.body;
  const { repo, branch } = req.body;
  
  if (!repo || !branch) console.log('Missing a repository and/or a branch');

  const cloneUrl = `https://github.com/${repo}.git#${branch}`;

  const repositoryName = 'deckhandapp';
  const imageName = branch;

  // for signing in:
  execSync(
    `aws --profile default configure set aws_access_key_id ${accessKey}`
  );
  execSync(
    `aws --profile default configure set aws_secret_access_key ${secretKey}`
  );
  execSync(`aws --profile default configure set region ${region}`);

  // grabs the user's account id

    const grabTheAWSAccountID = execSync(`aws sts get-caller-identity`, {
      encoding: 'utf8'
    });
    const makeGrabTheAWSAccountIdAString = JSON.parse(grabTheAWSAccountID);
    const awsAccountId = makeGrabTheAWSAccountIdAString.Account;

  // creating the repository in ECR
  
    execSync(`aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${awsAccountId}.dkr.ecr.${region}.amazonaws.com`
    );
    execSync(`aws ecr create-repository --repository-name ${repositoryName} --region ${region}`);

    // to help with architecture of images error

    execSync(`docker buildx build --platform linux/amd64 -t ${imageName} ${cloneUrl} --load`);
    execSync(`docker tag ${imageName} ${awsAccountId}.dkr.ecr.${region}.amazonaws.com/${repositoryName}:${imageName}`);
    execSync(`docker push ${awsAccountId}.dkr.ecr.${region}.amazonaws.com/${repositoryName}:${imageName}`);

    res.locals.data = { imageName: imageName, imageTag: 'latest' };
    return next();
};

module.exports = deploymentController;
