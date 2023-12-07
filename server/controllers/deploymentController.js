const terraform = require('../terraform/terraformapi.js');

const deploymentController = {};

deploymentController.addProject = (req, res, next) => {
  const { provider, name, region } = req.body.config;
  const { accessKey, secretKey } = req.body.cloudProviders[provider];
  terraform.connectToProvider(provider, region, accessKey, secretKey);
  // add terraform function: create VPC
  res.locals.data = { externalId }; // VPC ID
  next();
};

deploymentController.deleteProject = (req, res, next) => {
  const { externalId } = req.body;
  const { accessKey, secretKey } = req.body.cloudProviders[provider];
  // add terraform function: destroy VPC
  next();
};

deploymentController.addCluster = (req, res, next) => {
  const { provider } = req.body;
  const { accessKey, secretKey } = req.body.cloudProviders[provider];
  const { name, instanceType, minNodes, maxNodes } = req.body.config;
  // add terraform function: create cluster
  res.locals.data = { externalId }; // Cluster ID
  next();
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
