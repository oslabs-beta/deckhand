const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const util = require('util');
const execProm = util.promisify(exec);
require('dotenv').config();

// Create a terraform directory for the user
const initializeUser = (userId) => {
  console.log('Creating folder for user');
  try {
    execSync(`cd server/terraform/userData && mkdir user${userId}`);
  } catch (err) {
    console.log('Error: User directory already exists with that id.');
  }
};

const initializeProject = (userId, projectId) => {
  console.log('Creating folder for project');
  try {
    execSync(
      `cd server/terraform/userData/user${userId} && mkdir project${projectId}`
    );
  } catch (err) {
    console.log(
      'Error: Project directory already exists with that id for this user.'
    );
  }
};

// Writes variables file
// Does not run any Terraform scripts. Unnessecary until adding a VPC.
const connectToProvider = async (
  userId,
  projectId,
  provider,
  region,
  accessKey,
  secretKey
) => {
  console.log('entered connectToProvider');
  console.log(
    'Params:',
    userId,
    projectId,
    provider,
    region,
    accessKey,
    secretKey
  );

  if (provider === 'aws') {
    const variables = {
      region,
      accessKey,
      secretKey,
    };

    // Create a json file with the variables
    await fs.writeFile(
      `server/terraform/userData/user${userId}/project${projectId}/provider.auto.tfvars.json`,
      JSON.stringify(variables),
      (err) => {
        if (err) console.log('ERROR!', err);
        else console.log('Wrote provider variable file');
      }
    );
  }

  // copy provider file from template directory into terraform directory
  const projectPath = path.join(
    'server/terraform/userData',
    `user${userId}`,
    `project${projectId}`
  );
  console.log('copying provider.tf file');
  execSync(`cp server/templates/provider.tf ${projectPath}`);
  console.log('copied file!');
};

// Returns a promise that resolves to the VPC ID
const addVPC = async (userId, projectId, provider, vpc_name) => {
  console.log('entered addVPC');
  console.log('Params:', userId, projectId, provider, vpc_name);

  const variables = {
    vpc_name,
  };

  // write the variables to a tfvars file
  await fs.writeFile(
    `server/terraform/userData/user${userId}/project${projectId}/vpc.auto.tfvars.json`,
    JSON.stringify(variables),
    () => console.log('Wrote VPC variable file')
  );

  // copy VPC file from template directory into terraform directory
  const projectPath = path.join(
    'server/terraform/userData',
    `user${userId}`,
    `project${projectId}`
  );
  console.log('copying vpc.tf file');
  execSync(`cp server/templates/vpc.tf ${projectPath}`);
  console.log('copied file!');

  // applies the terraform files, provisioning a VPC
  await execProm(
    `cd ${projectPath} && terraform init && terraform apply --auto-approve`
  );

  // gets the vpc_id
  const vpcId = JSON.parse(
    (await execProm(`cd ${projectPath} && terraform output -json vpc_id`))
      .stdout
  );

  return vpcId;
};

// Tears down the VIP
const destroyVPC = async (userId, projectId) => {
  const status = await execProm(
    `cd server/terraform/userData/user${userId}/project${projectId} && terraform destroy --auto-approve`
  );

  return status;
};

// Creates and EKS cluster with nodes
const addCluster = async (
  userId,
  projectId,
  clusterId,
  clusterName,
  vpcId,
  min,
  max,
  desired,
  instanceType
) => {
  console.log('entered addCluster');
  console.log(
    'Params:',
    userId,
    projectId,
    clusterId,
    clusterName,
    vpcId,
    min,
    max,
    desired,
    instanceType
  );

  // copy eks file from template directory into terraform directory
  const projectPath = path.join(
    'server/terraform/userData',
    `user${userId}`,
    `project${projectId}`
  );

  console.log('Creating folder for cluster');

  execSync(`cd ${projectPath} && mkdir cluster${clusterId}`);

  console.log('copying eks.tf file');
  execSync(`cp server/templates/eks.tf ${projectPath}/cluster${clusterId}`);
  console.log('copied file!');

  // generate a random name from the clusterName and a number
  const nodeGroupName = clusterName + Math.floor(Math.random() * 100000);

  // Get private_subnets from vpc outputs
  const private_subnets = JSON.parse(
    (
      await execProm(
        `cd ${projectPath} && terraform output -json private_subnets`
      )
    ).stdout
  );

  console.log('SUBNET IDS:', private_subnets);

  const variables = {
    clusterName,
    vpcId,
    private_subnets,
    min,
    max,
    desired,
    instanceType,
    nodeGroupName,
  };

  // write the variables to a tfvars file
  await fs.writeFile(
    `${projectPath}/cluster${clusterId}/eks.auto.tfvars.json`,
    JSON.stringify(variables),
    () => console.log('Wrote eks variable file')
  );

  // applies the terraform files, provisioning a cluster
  const output = await execProm(
    `cd ${projectPath}/cluster${clusterId} && terraform init && terraform apply --auto-approve`
  );

  return output;

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

// Tears down the cluster
// Will this also destroy all the nodes inside or do I need to do that separately?
const destroyCluster = async (userId, projectId, clusterId) => {
  const status = await execProm(
    `cd server/terraform/userData/user${userId}/project${projectId}/cluster${clusterId} && terraform destroy --auto-approve`
  );

  return status;
};

module.exports = {
  connectToProvider,
  addVPC,
  destroyVPC,
  addCluster,
  initializeUser,
  initializeProject,
  destroyCluster,
};
