// This file is just for testing the terraform and k8 apis. It is not used in the functioning of the app.

const terraform = require('./terraform/terraformapi');
const k8 = require('./kubernetes/kubernetesapi');
const dotenv = require('dotenv');
dotenv.config();

const access_key = process.env.AWS_ACCESS_KEY;
const secret_key = process.env.AWS_SECRET_KEY;

const buildTest = () => {
  // create a user with id 2
  terraform.initializeUser(2);

  // for user 2, create a project with id 1
  terraform.initializeProject(2, 1);

  // for user 2, project 1, connect to provider
  terraform.connectToProvider(2, 1, 'aws', 'us-east-1', access_key, secret_key);

  // for user 2, project 1, provision VPC
  const vpc_idPromise = terraform.addVPC(2, 1, 'aws', 'dec19_1');
  let vpcId;

  vpc_idPromise
    .then((vpc_id) => {
      console.log('VPC ID:', vpc_id);
      vpcId = vpc_id;
      // for user 2, project 1, provision an EKS cluster with id 1
      terraform
        .addCluster(2, 1, 1, 'dec19_1', vpcId, 1, 3, 2, 't2.medium')
        .then((output) => console.log(output.stdout));
    })
    .catch((err) => console.log('CATCH:', err));

  // const status = terraform.destroyVPC(1, 3);
  // status.then((result) => console.log('RESOLVED:', result));
};

const k8deploytest = () => {
  const fs = require('fs');
  k8.connectKubectltoEKS('us-east-1', 'dec19_1');

  // App pod
  const deployment = fs.readFileSync(
    __dirname + '/templates/testyamls/IdeaStation/deployment.yaml'
  );
  const configMap = fs.readFileSync(
    __dirname + '/templates/testyamls/IdeaStation/configMap.yaml'
  );
  const service = fs.readFileSync(
    __dirname + '/templates/testyamls/IdeaStation/service.yaml'
  );
  const ingress = fs.readFileSync(
    __dirname + '/templates/testyamls/IdeaStation/ingress.yaml'
  );
  const nginx = fs.readFileSync(__dirname + '/kubernetes/nginx-ingress.yaml');

  // DB Pod
  const dbDeployment = fs.readFileSync(
    __dirname + '/templates/testyamls/IdeaStation/db-deployment.yaml'
  );
  const dbService = fs.readFileSync(
    __dirname + '/templates/testyamls/IdeaStation/postgres-service.yaml'
  );
  const pvc = fs.readFileSync(
    __dirname + '/templates/testyamls/IdeaStation/pvc.yaml'
  );
  const storageClass = fs.readFileSync(
    __dirname + '/templates/testyamls/IdeaStation/StorageClass.yaml'
  );
  const pv = fs.readFileSync(
    __dirname + '/templates/testyamls/IdeaStation/pv.yaml'
  );

  // Order matters!
  const yamls = [
    storageClass,
    pv,
    pvc,
    dbDeployment,
    dbService,
    configMap,
    deployment,
    service,
    // nginx,
    ingress,
  ];

  k8.deploy(yamls);
};

const undeploytest = () => {
  k8.remove('deployment', 'dennis');
};

const destroyTest = () => {
  // try destroying cluster with nodes inside it
  // make sure two EC2 instances get terminated

  // terraform.destroyVPC(2, 1).then(console.log);

  terraform.destroyCluster(2, 1, 1).then((output) => {
    console.log(output.stdout);
    terraform.destroyVPC(2, 1).then((output) => console.log(output.stdout));
  });

  // try destroying VPC that has a cluster inside. What happens?
};

const awsLogin = () => {
  k8.connectCLtoAWS(access_key, secret_key, 'us-east-1');
};

// buildTest();
// k8deploytest();
// undeploytest();
// destroyTest();
awsLogin();
// console.log(terraform.getEFSId(2, 1, 1));
