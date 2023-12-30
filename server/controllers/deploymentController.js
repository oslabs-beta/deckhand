const util = require('util');
const fs = require('fs/promises');
const path = require('path');
const { exec } = require('child_process');
const execAsync = util.promisify(exec);

const deploymentController = {};

deploymentController.addVPC = async (req, res, next) => {
  console.log('\n/api/deployment/addVPC:')
  const {
    userId,
    awsAccessKey,
    awsSecretKey,
    projectId,
    projectName,
    provider,
    vpcRegion,
  } = req.body;
  const vpcName = projectName.replace(/[^A-Z0-9]/gi, '').slice(0, 20) + projectId;
  const projectPath = path.join('server', 'terraform', 'userData', `user${userId}`, `project${projectId}`);

  try {
    // Check if user project directory exists and create it if not
    try {
      await fs.access(projectPath);
    } catch {
      console.log(`Creating project directory`);
      await execAsync(`mkdir -p ${projectPath}`);
    }

    // Create variables file for provider
    console.log('Creating provider.auto.tfvars.json');
    await fs.writeFile(path.join(projectPath, 'provider.auto.tfvars.json'),
      JSON.stringify({
        region: vpcRegion,
        accessKey: awsAccessKey,
        secretKey: awsSecretKey,
      })
    );

    // Copy provider terraform config to project directory
    console.log('Copying provider.tf to project directory')
    await execAsync(`cp ${path.join('server', 'templates', 'provider.tf')} ${projectPath}`);

    // Create variables file for VPC
    console.log('Creating vpc.auto.tfvars.json');
    await fs.writeFile(path.join(projectPath, 'vpc.auto.tfvars.json'),
      JSON.stringify({
        vpc_name: vpcName
      })
    );

    // Copy VPC terraform config to project directory
    console.log('Copying vpc.tf to project directory');
    await execAsync(`cp ${path.join('server', 'templates', 'vpc.tf')} ${projectPath}`);

    // Apply the terraform files in project directory (provider and VPC)
    console.log('Applying terraform configuration');
    await execAsync(`cd ${projectPath} && terraform init && terraform apply --auto-approve`);

    // Log success and continue
    console.log('Done')
    return next();
  } catch (err) {
    return next({
      log: `Error in addVPC: ${err}`,
      message: { err: 'An error occurred trying to create a VPC' },
    });
  }
};

deploymentController.deleteVPC = async (req, res, next) => {
  console.log('\n/api/deployment/deleteVPC:')
  const { userId, projectId } = req.body;
  const projectPath = path.join('server', 'terraform', 'userData', `user${userId}`, `project${projectId}`);

  // Skip if project directory doesn't exist
  try { await fs.access(projectPath) }
  catch {
    console.log(`Missing project directory, skipping VPC destruction`);
    return next();
  }

  try {
    // Destroy the VPC
    console.log('Destroying VPC');
    await execAsync(`cd ${projectPath} && terraform destroy --auto-approve`);

    // Remove project directory
    console.log('Removing project directory')
    await fs.rm(projectPath, { recursive: true });

    // Log success and continue
    console.log('Done')
    return next();
  } catch (err) {
    return next({
      log: `Error in deleteVPC: ${err}`,
      message: { err: 'An error occurred trying to delete a VPC' },
    });
  }
};

deploymentController.addCluster = async (req, res, next) => {
  console.log('\n/api/deployment/addCluster:')
  const {
    userId,
    awsAccessKey,
    awsSecretKey,
    vpcRegion,
    projectId,
    clusterName,
    clusterId,
    instanceType,
    minNodes,
    maxNodes,
    desiredNodes,
  } = req.body;
  const projectPath = path.join('server', 'terraform', 'userData', `user${userId}`, `project${projectId}`);
  const clusterPath = path.join(projectPath, `cluster${clusterId}`);
  const awsClusterName = clusterName.replace(/[^A-Z0-9]/gi, '').slice(0, 20) + clusterId;
  const nodeGroupName = 'ng-' + clusterId; // must be 1-38 characters

  try {
    // Copy EKS terraform config to cluster directory
    console.log('Copying eks.tf file to cluster directory');
    await execAsync(`cp ${path.join('server', 'templates', 'eks.tf')} ${path.join(clusterPath, `eks.tf`)}`);

    // Get VPC outputs
    console.log('Getting variables from VPC output');
    const vpcId = JSON.parse((await execAsync(`cd ${projectPath} && terraform output -json vpc_id`)).stdout);
    const private_subnets = JSON.parse((await execAsync(`cd ${projectPath} && terraform output -json private_subnets`)).stdout);
    const vpc_cidr_block = JSON.parse((await execAsync(`cd ${projectPath} && terraform output -json vpc_cidr_block`)).stdout);

    // Create variables file for EKS
    console.log('Creating eks.auto.tfvars.json');
    await fs.writeFile(path.join(clusterPath, 'eks.auto.tfvars.json'),
      JSON.stringify({
        clusterName: awsClusterName,
        vpcId,
        private_subnets,
        vpc_cidr_block,
        min: minNodes,
        max: maxNodes,
        desired: desiredNodes,
        instanceType,
        nodeGroupName,
      })
    );

    // Connect to AWS
    console.log('Connecting to aws')
    await execAsync(`aws --profile default configure set aws_access_key_id ${awsAccessKey}`);
    await execAsync(`aws --profile default configure set aws_secret_access_key ${awsSecretKey}`);
    await execAsync(`aws --profile default configure set region ${vpcRegion}`);

    // Apply the Terraform files to provision a cluster
    console.log('Applying terraform configuration');
    const output = await execAsync(`cd ${clusterPath} && terraform init && terraform apply --auto-approve`);
    console.log('output:', output)

    // Get volume handle (EFS ID)
    console.log('Getting volume handle (EFS ID)');
    const volumeHandle = await execAsync(`cd ${clusterPath} && terraform output -json efs-id`, { encoding: 'utf8', });
    res.locals.data = { awsClusterName, volumeHandle };

    // Log success and continue
    console.log('Done')
    return next();
  } catch (err) {
    return next({
      log: `Error in deploymentController.addCluster: ${err}`,
      message: { err: 'An error occurred trying to create a cluster' },
    });
  }
};

deploymentController.deleteCluster = async (req, res, next) => {
  console.log('\n/api/deployment/deleteCluster:')
  const { userId, projectId, clusterId } = req.body;
  const clusterPath = path.join('server', 'terraform', 'userData', `user${userId}`, `project${projectId}`, `cluster${clusterId}`);

  try {
    // Destroy the cluster
    console.log('Destroying cluster');
    await execAsync(`cd ${clusterPath} && terraform destroy --auto-approve`);

    // Remove cluster directory
    console.log('Removing cluster directory')
    await fs.rm(clusterPath, { recursive: true });

    // Log success and continue
    console.log('Done')
    return next();
  } catch (err) {
    return next({
      log: `Error in deleteCluster: ${err}`,
      message: { err: 'An error occurred trying to delete a cluster' },
    });
  }
};

// Dockerize github repo and push to AWS ECR
deploymentController.buildImage = async (req, res, next) => {
  console.log('\n/api/deployment/buildImage:')
  const { repo, branch, awsAccessKey, awsSecretKey, vpcRegion } = req.body;
  const awsRepo = repo.split('/').join('-').toLowerCase(); // format: "githubUser-repoName"
  const imageName = repo.split('/').join('-').toLowerCase() + `-${branch}`; // format: "githubUser-repoName-branch"

  try {
    // Connect to AWS
    console.log('Connecting to aws')
    await execAsync(`aws --profile default configure set aws_access_key_id ${awsAccessKey}`);
    await execAsync(`aws --profile default configure set aws_secret_access_key ${awsSecretKey}`);
    await execAsync(`aws --profile default configure set region ${vpcRegion}`);

    // Get AWS account ID
    console.log('Getting AWS account ID')
    const awsAccountId = JSON.parse(await execAsync(`aws sts get-caller-identity`, { encoding: 'utf8' })).Account;

    // Create ECR repository for pod
    console.log('Creating ECR repository')
    const ecrUrl = `${awsAccountId}.dkr.ecr.${vpcRegion}.amazonaws.com`;
    await execAsync(`aws ecr get-login-password --region ${vpcRegion} | docker login --username AWS --password-stdin ${ecrUrl}`);
    await execAsync(`aws ecr create-repository --repository-name ${awsRepo} --region ${vpcRegion} || true`);

    // Dockerize and push image to ECR repository
    console.log('Dockerizing and pushing image to ECR repository')
    const cloneUrl = `https://github.com/${repo}.git#${branch}`;
    const imageUrl = `${ecrUrl}/${awsRepo}`;
    await execAsync(`docker buildx build --platform linux/amd64 -t ${imageName} ${cloneUrl} --load`);
    await execAsync(`docker tag ${imageName} ${imageUrl}`);
    await execAsync(`docker push ${imageUrl}`);

    // Log success and continue
    console.log('Done')
    res.locals.data = { awsRepo, imageName: imageUrl, imageTag: 'latest' };
    return next();
  } catch (err) {
    return next({
      log: `Error in buildImage: ${err}`,
      message: { err: 'An error occurred trying to build an image' },
    });
  }
};

deploymentController.deleteImage = async (req, res, next) => {
  console.log('\n/api/deployment/deleteImage:')
  const { awsAccessKey, awsSecretKey, vpcRegion, awsRepo, imageName, imageTag } =
    req.body;

  try {
    // Connect to AWS
    console.log('Connecting to aws')
    await execAsync(`aws --profile default configure set aws_access_key_id ${awsAccessKey}`);
    await execAsync(`aws --profile default configure set aws_secret_access_key ${awsSecretKey}`);
    await execAsync(`aws --profile default configure set region ${vpcRegion}`);

    // Delete image
    console.log('Deleting image')
    await execAsync(`aws ecr batch-delete-image --repository-name ${awsRepo} --image-ids imageTag=${imageTag} --region ${vpcRegion}`);

    // Log success and continue
    console.log('Done')
    return next();
  } catch (err) {
    return next({
      log: `Error in deleteImage: ${err}`,
      message: { err: 'An error occurred trying to delete an image' },
    });
  }
};

deploymentController.deployPod = async (req, res, next) => {
  console.log('\n/api/deployment/deployPod:')
  const { awsAccessKey, awsSecretKey, vpcRegion, awsClusterName, yaml } = req.body;

  try {
    // Connect to aws via command line
    console.log('Connecting to aws')
    await execAsync(`aws --profile default configure set aws_access_key_id ${awsAccessKey}`);
    await execAsync(`aws --profile default configure set aws_secret_access_key ${awsSecretKey}`);
    await execAsync(`aws --profile default configure set region ${vpcRegion}`);

    // Connect kubectl to EKS cluster via aws
    console.log('Connecting kubectl')
    await execAsync(`aws eks update-kubeconfig --region ${vpcRegion} --name ${awsClusterName}`);

    // Deploy nginx controller
    console.log('Deploying nginx controller')
    await execAsync(`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/aws/deploy.yaml`);

    // Apply yaml (deploys pod)
    const output = await execAsync(`echo "${yaml}" | kubectl apply -f -`, { encoding: 'utf8', });
    console.log(output)

    // Log success and continue
    console.log('Done')
    return next();
  } catch (err) {
    return next({
      log: `Error in deployPod: ${err}`,
      message: { err: 'An error occurred trying to deploy a pod' },
    });
  }
};

deploymentController.deletePod = async (req, res, next) => {
  console.log('\n/api/deployment/deletePod:')
  const { vpcRegion, awsAccessKey, awsSecretKey, awsClusterName, podName } = req.body;

  try {
    // Connect to AWS
    console.log('Connecting to aws')
    await execAsync(`aws --profile default configure set aws_access_key_id ${awsAccessKey}`);
    await execAsync(`aws --profile default configure set aws_secret_access_key ${awsSecretKey}`);
    await execAsync(`aws --profile default configure set region ${vpcRegion}`);

    // Connect kubectl to EKS cluster via aws
    console.log('Connecting kubectl')
    await execAsync(`aws eks update-kubeconfig --region ${vpcRegion} --name ${awsClusterName}`);

    // Delete deployment
    await execAsync(`kubectl delete 'deployment' ${podName}`);

    // Log success and continue
    console.log('Done')
    return next();
  } catch (err) {
    return next({
      log: `Error in deletePod: ${err}`,
      message: { err: 'An error occurred trying to delete a pod' },
    });
  }
};

deploymentController.getURL = async (req, res, next) => {
  console.log('\n/api/deployment/getURL:')
  const { awsAccessKey, awsSecretKey, vpcRegion, awsClusterName } = req.body;

  try {
    // Connect to AWS
    console.log('Connecting to aws')
    await execAsync(`aws --profile default configure set aws_access_key_id ${awsAccessKey}`);
    await execAsync(`aws --profile default configure set aws_secret_access_key ${awsSecretKey}`);
    await execAsync(`aws --profile default configure set region ${vpcRegion}`);

    // Connect kubectl to EKS cluster via aws
    console.log('Connecting kubectl')
    await execAsync(`aws eks update-kubeconfig --region ${vpcRegion} --name ${awsClusterName}`);

    // Get public ingress URL
    console.log('Getting public ingress URL')
    let attempts = 0;
    const checkURL = async () => {
      const url = await execAsync(`kubectl get ingress -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}'`, { encoding: 'utf8' });
      if (url) {
        console.log('URL:', url)
        res.locals.data = { url };

        // Log success and continue
        console.log('Done')
        return next();
      } else {
        if (attempts++ < 100) setTimeout(checkURL, 1000)
        else console.log('Exceeded 100 attempts to get URL')
      }
    };
    checkURL();

  } catch (err) {
    return next({
      log: `Error in getUrl: ${err}`,
      message: { err: 'An error occurred trying to get ingress URL' },
    });
  }
};

module.exports = deploymentController;
