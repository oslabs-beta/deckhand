const terraform = require('./terraform/terraformapi');
require('dotenv').config();

terraform.connectToProvider(
  'AWS',
  'us-east-1',
  process.env.AWS_ACCESS_KEY,
  process.env.AWS_SECRET_KEY
);

// Keys came from IAM. Create a key with specific permissions

const vpc_idPromise = terraform.addVPC('AWS', 'dec-4-vpc');

vpc_idPromise
  .then((vpc_id) => console.log('VPC ID:', vpc_id))
  .catch((err) => console.log('CATCH:', err));
/// addVPC needs to return an id from amazon of the VPC id.
// same with creating the cluster

// also need to explore how to destory or delete with multiple users.

// figure out how to edit config file to connect to aws per user
