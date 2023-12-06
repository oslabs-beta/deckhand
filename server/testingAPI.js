const terraform = require('./terraform/terraformapi');
const dotenv = require('dotenv');
dotenv.config();

const access_key = process.env.AWS_ACCESS_KEY;
const secret_key = process.env.AWS_SECRET_KEY;

terraform.connectToProvider('AWS', 'us-east-1', access_key, secret_key);

// Keys came from IAM. Create a key with specific permissions

const vpc_idPromise = terraform.addVPC('AWS', 'dec5');
let vpcId;
console.log('line14');
console.log('"vpc_idPromise', vpc_idPromise);
vpc_idPromise
  .then((vpc_id) => {
    console.log('VPC ID:', vpc_id);
    vpcId = vpc_id;
    terraform.addCluster('dec5', vpcId, 1, 3, 't2.micro');
  })
  .catch((err) => console.log('CATCH:', err));

// addVPC needs to return an id from amazon of the VPC id.
// same with creating the cluster

// terraform.addCluster(clusterName, vpcId, min, max, instanceType);

// also need to explore how to destory or delete with multiple users.

// figure out how to edit config file to connect to aws per user
