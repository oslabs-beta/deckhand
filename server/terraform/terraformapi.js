const fs = require('fs');
const { exec, execSync } = require('child_process');
const util = require('util');
const execProm = util.promisify(exec);
require('dotenv').config();

const connectToProvider = async (provider, region, accessKey, secretKey) => {
  console.log('entered connectToProvider');
  console.log('Params:', provider, region, accessKey, secretKey);

  if (provider === 'AWS') {
    const variables = {
      region,
      accessKey,
      secretKey,
    };

    // Create a json file with the variables
    await fs.writeFile(
      'server/terraform/provider.auto.tfvars.json',
      JSON.stringify(variables),
      (err) => {
        if (err) console.log(err);
        else console.log('Wrote provider variable file');
      }
    );
  }
};

// returns a promise that resolves to the VPC ID
const addVPC = async (provider, vpc_name) => {
  console.log('entered addVPC');
  console.log('Params:', provider, vpc_name);

  const variables = {
    vpc_name,
  };

  await fs.writeFile(
    'server/terraform/vpc.auto.tfvars.json',
    JSON.stringify(variables),
    () => console.log('Wrote VPC variable file')
  );

  await execProm(
    'cd server/terraform && terraform init && terraform apply --auto-approve'
  );

  // gets the vpc_id
  const vpcId = JSON.parse(
    (await execProm('cd server/terraform && terraform output -json vpc_id'))
      .stdout
  );

  return vpcId;
};

const addCluster = async (clusterName, vpcId, min, max, instanceType) => {
  //need a nodegroup id - make it the cluster name plus a random hash
  console.log('entered addCluster');
  console.log('Params:', clusterName, vpcId, min, max, instanceType);

  // copy eks file from template directory into terraform directory
  console.log('copying file');
  execSync('cp server/templates/eks.tf server/terraform');
  console.log('copied file!');

  const nodeGroupName = clusterName + Math.floor(Math.random() * 100000); // generate a random name from the clusterName and a number

  //need to store the vpc id
  const variables = {
    clusterName,
    vpcId,
    min,
    max,
    instanceType,
    nodeGroupName,
  };

  await fs.writeFile(
    'server/terraform/eks.auto.tfvars.json',
    JSON.stringify(variables),
    () => console.log('Wrote eks variable file')
  );

  const output = await execProm(
    'cd server/terraform && terraform init && terraform apply --auto-approve'
  );
  //.stdout;
  console.log('OUTPUT', output);

  output.then((log) => {
    console.log('FINISHED PROVISIONING CLUSTER');
    console.log(log);
  });
};

module.exports = { connectToProvider, addVPC, addCluster };
