const terraform = require('./terraform/terraformapi');
const k8 = require('./kubernetesapi');
const dotenv = require('dotenv');
dotenv.config();

const access_key = process.env.AWS_ACCESS_KEY;
const secret_key = process.env.AWS_SECRET_KEY;

terraform
  .connectToProvider('aws', 'us-east-1', access_key, secret_key)
  .then(() => {
    const vpc_idPromise = terraform.addVPC('aws', 'dec7vpc3');
    let vpcId;

    vpc_idPromise
      .then((vpc_id) => {
        console.log('VPC ID:', vpc_id);
        vpcId = vpc_id;
        terraform.addCluster('dec7cluster3', vpcId, 1, 3, 't2.medium');
      })
      .catch((err) => console.log('CATCH:', err));
  });
// addCluster needs to return an id?

// also need to explore how to destory or delete with multiple users.
