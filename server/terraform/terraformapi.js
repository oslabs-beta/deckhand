const fs = require('fs');
const { exec, execSync } = require('child_process');
const util = require('util');
const execProm = util.promisify(exec);
require('dotenv').config();

// Writes variables file
// Does not yet run any Terraform scripts. Unnessecary until adding a VPC.
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

// Returns a promise that resolves to the VPC ID
const addVPC = async (provider, vpc_name) => {
  console.log('entered addVPC');
  console.log('Params:', provider, vpc_name);

  const variables = {
    vpc_name,
  };

  // write the variables to a tfvars file
  await fs.writeFile(
    'server/terraform/vpc.auto.tfvars.json',
    JSON.stringify(variables),
    () => console.log('Wrote VPC variable file')
  );

  // applies the terraform files, provisioning a VPC
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
  console.log('entered addCluster');
  console.log('Params:', clusterName, vpcId, min, max, instanceType);

  // copy eks file from template directory into terraform directory
  console.log('copying file');
  execSync('cp server/templates/eks.tf server/terraform');
  console.log('copied file!');

  // generate a random name from the clusterName and a number
  const nodeGroupName = clusterName + Math.floor(Math.random() * 100000);

  const variables = {
    clusterName,
    vpcId,
    min,
    max,
    instanceType,
    nodeGroupName,
  };

  // write the variables to a tfvars file
  await fs.writeFile(
    'server/terraform/eks.auto.tfvars.json',
    JSON.stringify(variables),
    () => console.log('Wrote eks variable file')
  );

  // applies the terraform files, provisioning a cluster
  await execProm(
    'cd server/terraform && terraform init && terraform apply --auto-approve'
  );

  // this will eventually be written to get whatever necessary ids we need from the cluster
  //   const output = JSON.parse(
  //     (await execProm('cd server/terraform && terraform output -json <INSERT NEEDED OUTPUTS HERE>'))
  //       .stdout
  //   );
  //   console.log('OUTPUT', output);

  //   output.then((log) => {
  //     console.log('FINISHED PROVISIONING CLUSTER');
  //     console.log(log);
  //   });
};

module.exports = { connectToProvider, addVPC, addCluster };
