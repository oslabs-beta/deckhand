const fs = require('fs').promises;
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
  awsAccessKey,
  awsSecretKey
) => {
  console.log('entered connectToProvider');
  console.log(
    'Params:',
    userId,
    projectId,
    provider,
    region,
    awsAccessKey,
    awsSecretKey
  );

  if (provider === 'aws') {
    const variables = {
      region,
      accessKey: awsAccessKey,
      secretKey: awsSecretKey,
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
  execSync(
    `cd ${projectPath} && terraform init && terraform apply --auto-approve`
  );

  // gets the vpc_id
  const vpcId = JSON.parse(
    (await execProm(`cd ${projectPath} && terraform output -json vpc_id`))
      .stdout
  );

  return vpcId;
};

// Tears down the VPC
const destroyVPC = async (userId, projectId) => {
  // tear it down in AWS
  const status = await execProm(
    `cd server/terraform/userData/user${userId}/project${projectId} && terraform destroy --auto-approve`
  );

  // remove directory from server
  execSync(
    `cd server/terraform/userData/user${userId} && rm -r project${projectId}`
  );

  return status;
};

// Creates and EKS cluster with nodes
const addCluster = async (
  userId,
  projectId,
  clusterName,
  vpcId,
  min,
  max,
  desired,
  instanceType
) => {
  console.log('entered addCluster in api');
  console.log(
    'Params:',
    userId,
    projectId,
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

  execSync(`cd ${projectPath} && mkdir cluster${clusterName}`);

  console.log('copying eks.tf file');
  execSync(`cp server/templates/eks.tf ${projectPath}/cluster${clusterName}`);
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

  // Get "vpc_cidr_block" from vpc outputs
  const vpc_cidr_block = JSON.parse(
    (
      await execProm(
        `cd ${projectPath} && terraform output -json vpc_cidr_block`
      )
    ).stdout
  );

  console.log('SUBNET IDS:', private_subnets);
  console.log('CIDR BLOCK:', vpc_cidr_block);

  const variables = {
    clusterName,
    vpcId,
    private_subnets,
    vpc_cidr_block,
    min,
    max,
    desired,
    instanceType,
    nodeGroupName,
  };

  // write the variables to a tfvars file
  await fs.writeFile(
    `${projectPath}/cluster${clusterName}/eks.auto.tfvars.json`,
    JSON.stringify(variables),
    () => console.log('Wrote eks variable file')
  );

  // applies the terraform files, provisioning a cluster
  const output = await execProm(
    `cd ${projectPath}/cluster${clusterName} && terraform init && terraform apply --auto-approve`
  );

  return output;
};

// Tears down the cluster
// Will this also destroy all the nodes inside including anything that was deployed into those nodes.
const destroyCluster = async (userId, projectId, clusterName) => {
  const status = await execProm(
    `cd server/terraform/userData/user${userId}/project${projectId}/cluster${clusterName} && terraform destroy --auto-approve`
  );

  // remove directory from server
  execSync(
    `cd server/terraform/userData/user${userId}/project${projectId} && rm -r cluster${clusterName}`
  );

  return status;
};

const getEFSId = (userId, projectId, clusterName) => {
  const clusterPath = path.join(
    'server/terraform/userData',
    `user${userId}`,
    `project${projectId}`,
    `cluster${clusterName}`
  );

  const efsId = execSync(`cd ${clusterPath} && terraform output -json efs-id`, {
    encoding: 'utf8',
  });
  return efsId;
};

module.exports = {
  connectToProvider,
  addVPC,
  destroyVPC,
  addCluster,
  initializeUser,
  initializeProject,
  destroyCluster,
  getEFSId,
};
