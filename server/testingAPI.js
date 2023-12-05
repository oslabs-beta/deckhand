const terraform = require('./terraform/terraformapi');

terraform.connectToProvider(
  'AWS',
  'us-east-1',
  'AKIAQ2YPHOD4DOYI52GP',
  'DXx8VzKOuttbXy5SoNsLItwTyA9d3V4cKkq+yfng'
);

const vpc_idPromise = terraform.addVPC('AWS', 'dec-4-vpc');

vpc_idPromise
  .then((vpc_id) => console.log('VPC ID:', vpc_id))
  .catch((err) => console.log('CATCH:', err));
/// addVPC needs to return an id from amazon of the VPC id.
// same with creating the cluster

// also need to explore how to destory or delete with multiple users.

// figure out how to edit config file to connect to aws per user
