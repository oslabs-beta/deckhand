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
  const vpc_idPromise = terraform.addVPC(2, 1, 'aws', 'dec16_2');
  let vpcId;

  vpc_idPromise
    .then((vpc_id) => {
      console.log('VPC ID:', vpc_id);
      vpcId = vpc_id;
      // for user 2, project 1, provision an EKS cluster with id 1
      terraform
        .addCluster(2, 1, 1, 'dec16_2', vpcId, 1, 3, 2, 't2.medium')
        .then((output) => console.log(output.stdout));
    })
    .catch((err) => console.log('CATCH:', err));

  // const status = terraform.destroyVPC(1, 3);
  // status.then((result) => console.log('RESOLVED:', result));
};

const k8deploytest = () => {
  const fs = require('fs');
  k8.connectKubectltoEKS('us-east-1', 'dec16_2');

  const driver = fs.readFileSync(
    __dirname + '/terraform/public-ecr-driver.yaml'
  );
  const storageClass = fs.readFileSync(
    __dirname + '/templates/yamls/StorageClass.yaml'
  );
  const PV = fs.readFileSync(__dirname + '/templates/yamls/PV.yaml');
  const PVC = fs.readFileSync(__dirname + '/templates/yamls/PVC.yaml');
  const deployment = fs.readFileSync(
    __dirname + '/templates/yamls/nginxdeploy.yaml'
  );

  const yamls = [driver, storageClass, PV, PVC, deployment];

  k8.deploy(yamls);
  // k8.deploy([deployment]);
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

buildTest();
// k8deploytest();
// undeploytest();
// destroyTest();

// console.log(terraform.getEFSId(2, 1, 1));
