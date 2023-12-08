const terraform = require('../terraform/terraformapi.js');

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
    });

  //Add error handling
};

deploymentController.deleteProject = (req, res, next) => {
  const { externalId } = req.body;
  const { accessKey, secretKey } = req.body.cloudProviders[provider];
  // add terraform function: destroy VPC
  next();
};

deploymentController.addCluster = (req, res, next) => {
  const { provider, VPCId } = req.body;
  const { accessKey, secretKey } = req.body.cloudProviders[provider];
  const { name, instanceType, minNodes, maxNodes, desiredNodes } =
    req.body.config;
  const cleanName = name.replace(/[^A-Z0-9]/gi, '_').toLowerCase();

  terraform
    .addCluster(
      cleanName,
      VPCId,
      minNodes,
      maxNodes,
      desiredNodes,
      instanceType
    )
    .then(() => {
      res.locals.data = {}; // Put a cluster ID here if needed ... may not need
      return next();
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

module.exports = deploymentController;
