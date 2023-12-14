const terraform = require('./terraform/terraformapi');
const k8 = require('./kubernetes/kubernetesapi');
const dotenv = require('dotenv');
dotenv.config();

const access_key = process.env.AWS_ACCESS_KEY;
const secret_key = process.env.AWS_SECRET_KEY;

// create a user with id 1
terraform.initializeUser(1);

// for user 1, create a project with id 3
terraform.initializeProject(1, 3);

// for user 1, project 3, connect to provider
terraform.connectToProvider(1, 3, 'aws', 'us-east-1', access_key, secret_key);

// for user 1, project 3, provision VPC
const vpc_idPromise = terraform.addVPC(1, 3, 'aws', 'dec11_6');
let vpcId;

vpc_idPromise
  .then((vpc_id) => {
    console.log('VPC ID:', vpc_id);
    vpcId = vpc_id;
    // for user 1, project 3, provision an EKS cluster naled dec14_1
    terraform.addCluster(1, 3, 1, 'dec14_1', vpcId, 1, 3, 2, 't2.micro');
  })
  .catch((err) => console.log('CATCH:', err));

// const status = terraform.destroyVPC(1, 3);
// status.then((result) => console.log('RESOLVED:', result));
