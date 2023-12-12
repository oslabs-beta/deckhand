const terraform = require('./terraform/terraformapi');
const k8 = require('./kubernetes/kubernetesapi');
const dotenv = require('dotenv');
dotenv.config();

const access_key = process.env.AWS_ACCESS_KEY;
const secret_key = process.env.AWS_SECRET_KEY;

// terraform.initializeUser(1);

// terraform.initializeProject(1, 3);

// terraform.connectToProvider(1, 3, 'aws', 'us-east-1', access_key, secret_key);

// const vpc_idPromise = terraform.addVPC(1, 3, 'aws', 'dec11_5');
// let vpcId;

// vpc_idPromise
//   .then((vpc_id) => {
//     console.log('VPC ID:', vpc_id);
//     vpcId = vpc_id;
//     //terraform.addCluster('dec5', vpcId, 1, 3, 't2.micro');
//   })
//   .catch((err) => console.log('CATCH:', err));

const status = terraform.destroyVPC(1, 3);
status.then((result) => console.log('RESOLVED:', result));
