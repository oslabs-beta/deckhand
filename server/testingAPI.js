const terraform = require('./terraform/terraformapi');
const k8 = require('./kubernetesapi');
const dotenv = require('dotenv');
dotenv.config();

const access_key = process.env.AWS_ACCESS_KEY;
const secret_key = process.env.AWS_SECRET_KEY;

terraform.connectToProvider('AWS', 'us-east-1', access_key, secret_key);

const vpc_idPromise = terraform.addVPC('AWS', 'dec6vpc2');
let vpcId;

vpc_idPromise
  .then((vpc_id) => {
    console.log('VPC ID:', vpc_id);
    vpcId = vpc_id;
    terraform.addCluster('dec6cluster2', vpcId, 1, 3, 't2.micro');
  })
  .catch((err) => console.log('CATCH:', err));

// addCluster needs to return an id?

// also need to explore how to destory or delete with multiple users.
