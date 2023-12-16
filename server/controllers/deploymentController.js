const terraform = require('../terraform/terraformapi.js');
const { execSync, exec } = require('child_process');

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
  const { externalId } = req.body;
  const { accessKey, secretKey } = req.body.cloudProviders[provider];
  // add terraform function: destroy VPC
  next();
};

deploymentController.addCluster = (req, res, next) => {
  const { provider, externalId } = req.body;
  const { accessKey, secretKey } = req.body.cloudProviders[provider];
  const { name, instanceType, minNodes, maxNodes, desiredNodes } =
    req.body.config;
  const cleanName = name.replace(/[^A-Z0-9]/gi, '_').toLowerCase();

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
};

deploymentController.deleteCluster = (req, res, next) => {
  const { provider } = req.body;
  const { accessKey, secretKey } = req.body.cloudProviders[provider];
  const { vpcId, clusterId } = req.body.ids;
  // add terraform function: destroy cluster
  next();
};

deploymentController.configureCluster = (req, res, next) => {
  const { provider } = req.body;
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
  const nameOfImage = branch;

  // for signing in:
  execSync(
    `aws --profile default configure set aws_access_key_id ${accessKey}`
  );
  execSync(
    `aws --profile default configure set aws_secret_access_key_id ${secretKey}`
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

    // this creates an image and pushes it

    execSync(`docker build -t ${nameOfImage} ${cloneUrl}`);
    execSync(`docker tag ${nameOfImage} ${awsAccountId}.dkr.ecr.${region}.amazonaws.com/${repositoryName}`);
    execSync(`docker push ${awsAccountId}.dkr.ecr.${region}.amazonaws.com/${repositoryName}`);

    res.locals.data = { imageName: nameOfImage, imageTag: 'latest' };
    return next();
};

module.exports = deploymentController;
