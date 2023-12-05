const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execProm = util.promisify(exec);

const connectToProvider = async (provider, region, accessKey, secretKey) => {
  if (provider === 'AWS') {
    const variables = {
      region,
      accessKey,
      secretKey,
    };

    // Create a json file with the variables
    await fs.writeFile(
      './terraform/provider.auto.tfvars.json',
      JSON.stringify(variables),
      () => console.log('Wrote provider variable file')
    );
  }
};

// returns a promise that resolves to the VPC ID
const addVPC = async (provider, vpc_name) => {
  const variables = {
    vpc_name,
  };

  await fs.writeFile(
    './terraform/vpc.auto.tfvars.json',
    JSON.stringify(variables),
    () => console.log('Wrote VPC variable file')
  );

  await execProm(
    'cd terraform && terraform init && terraform apply --auto-approve && terraform output'
  );

  // gets the vpc_id
  const vpcId = JSON.parse(
    (await execProm('cd terraform && terraform output -json vpc_id')).stdout
  );

  return vpcId;
};

const addCluster = async (clusterName, vpcId, min, max, instanceType) => {
  //need a nodegroup id - make it the cluster name plus a random hash

  //need to store the vpc id
  const variables = {
    clusterName,
    min,
    max,
    instanceType,
  };
};

module.exports = { connectToProvider, addVPC };
