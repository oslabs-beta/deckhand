const terraformController = {};

terraformController.addProject = (req, res, next) => {
  const { provider, name, region } = req.body.config;
  const { accessKey, secretKey } = req.body.linkedAccounts[provider];
  // add terraform function: create VPC
  res.locals.data = { externalId } // VPC ID
  next();
};

terraformController.deleteProject = (req, res, next) => {
  const { externalId } = req.body;
  const { accessKey, secretKey } = req.body.linkedAccounts[provider];
  // add terraform function: destroy VPC
  next();
};

terraformController.addCluster = (req, res, next) => {
  const { provider } = req.body;
  const { accessKey, secretKey } = req.body.linkedAccounts[provider];
  const { name, instanceType, minNodes, maxNodes } = req.body.config;
  // add terraform function: create cluster
  res.locals.data = { externalId } // Cluster ID
  next();
};

terraformController.deleteCluster = (req, res, next) => {
  const { provider } = req.body;
  const { accessKey, secretKey } = req.body.linkedAccounts[provider];
  const { vpcId, clusterId } = req.body.ids;
  // add terraform function: destroy cluster
  next();
};

terraformController.configureCluster = (req, res, next) => {
  const { provider } = req.body;
  const { accessKey, secretKey } = req.body.linkedAccounts[provider];
  const { vpcId, clusterId } = req.body.ids;
  const { yamls } = req.body.yamls;
  // add terraform function: apply yamls to cluster
  next();
};

module.exports = terraformController;
