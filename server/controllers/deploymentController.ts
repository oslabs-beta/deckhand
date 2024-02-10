// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'util'.
const util = require('util');
// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs/promises');
// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require('path');
// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'exec'.
const { exec } = require('child_process');
// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'execAsync'... Remove this comment to see the full error message
const execAsync = util.promisify(exec);
const AWS = require('aws-sdk');

// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'deployment... Remove this comment to see the full error message
const deploymentController = {};

// @ts-expect-error TS(2339) FIXME: Property 'addVPC' does not exist on type '{}'.
deploymentController.addVPC = async (req: any, res: any, next: any) => {
  console.log('\n/api/deployment/addVPC:');
  const {
    userId,
    awsAccessKey,
    awsSecretKey,
    projectId,
    projectName,
    provider,
    vpcRegion,
  } = req.body;
  const vpcName =
    projectName.replace(/[^A-Z0-9]/gi, '').slice(0, 20) + projectId;
  const projectPath = path.join(
    'server',
    'terraform',
    'userData',
    `user${userId}`,
    `project${projectId}`
  );

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
    await fs.writeFile(
      path.join(projectPath, 'provider.auto.tfvars.json'),
      JSON.stringify({
        region: vpcRegion,
        accessKey: awsAccessKey,
        secretKey: awsSecretKey,
      })
    );

    // Copy provider terraform config to project directory
    console.log('Copying provider.tf to project directory');
    await execAsync(
      `cp ${path.join('server', 'terraform', 'templates', 'provider.tf')} ${projectPath}`
    );

    // Create variables file for VPC
    console.log('Creating vpc.auto.tfvars.json');
    await fs.writeFile(
      path.join(projectPath, 'vpc.auto.tfvars.json'),
      JSON.stringify({
        vpc_name: vpcName,
      })
    );

    // Copy VPC terraform config to project directory
    console.log('Copying vpc.tf to project directory');
    await execAsync(
      `cp ${path.join('server', 'terraform', 'templates', 'vpc.tf')} ${projectPath}`
    );

    // Apply the terraform files in project directory (provider and VPC)
    console.log('Applying terraform configuration');
    await execAsync(
      `cd ${projectPath} && terraform init && terraform apply --auto-approve`
    );

    // Log success and continue
    console.log('Done');
    return next();
  } catch (err) {
    return next({
      log: `Error in addVPC: ${err}`,
      message: { err: 'An error occurred trying to create a VPC' },
    });
  }
};

// @ts-expect-error TS(2339) FIXME: Property 'deleteVPC' does not exist on type '{}'.
deploymentController.deleteVPC = async (req: any, res: any, next: any) => {
  console.log('\n/api/deployment/deleteVPC:');
  const { userId, projectId } = req.body;
  const projectPath = path.join(
    'server',
    'terraform',
    'userData',
    `user${userId}`,
    `project${projectId}`
  );

  // Skip if project directory doesn't exist
  try {
    await fs.access(projectPath);
  } catch {
    console.log(`Missing project directory, skipping VPC destruction`);
    return next();
  }

  try {
    // Destroy the VPC
    console.log('Destroying VPC');
    await execAsync(`cd ${projectPath} && terraform destroy --auto-approve`);

    // Remove project directory
    console.log('Removing project directory');
    await fs.rm(projectPath, { recursive: true });

    // Log success and continue
    console.log('Done');
    return next();
  } catch (err) {
    return next({
      log: `Error in deleteVPC: ${err}`,
      message: { err: 'An error occurred trying to delete a VPC' },
    });
  }
};

// @ts-expect-error TS(2339) FIXME: Property 'addCluster' does not exist on type '{}'.
deploymentController.addCluster = async (req: any, res: any, next: any) => {
  console.log('\n/api/deployment/addCluster:');
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
  const projectPath = path.join(
    'server',
    'terraform',
    'userData',
    `user${userId}`,
    `project${projectId}`
  );
  const clusterPath = path.join(projectPath, `cluster${clusterId}`);
  const awsClusterName =
    clusterName.replace(/[^A-Z0-9]/gi, '').slice(0, 20) + clusterId;
  const nodeGroupName = 'ng-' + clusterId; // must be 1-38 characters

  try {
    // Create cluster directory
    console.log(`Creating cluster directory`);
    await execAsync(`mkdir -p ${clusterPath}`);

    // Copy EKS terraform config to cluster directory
    console.log('Copying eks.tf file to cluster directory');
    await execAsync(
      `cp ${path.join('server', 'terraform', 'templates', 'eks.tf')} ${path.join(
        clusterPath,
        `eks.tf`
      )}`
    );

    // Copy provider files to cluster directory
    console.log('Copying provider files to cluster directory');
    await execAsync(
      `cp ${path.join(projectPath, 'provider.tf')} ${path.join(
        clusterPath,
        `provider.tf`
      )}`
    );
    await execAsync(
      `cp ${path.join(projectPath, 'provider.auto.tfvars.json')} ${path.join(
        clusterPath,
        `provider.auto.tfvars.json`
      )}`
    );

    // Get VPC outputs
    console.log('Getting variables from VPC output');
    const vpcId = JSON.parse(
      (await execAsync(`cd ${projectPath} && terraform output -json vpc_id`))
        .stdout
    );
    const private_subnets = JSON.parse(
      (
        await execAsync(
          `cd ${projectPath} && terraform output -json private_subnets`
        )
      ).stdout
    );
    const vpc_cidr_block = JSON.parse(
      (
        await execAsync(
          `cd ${projectPath} && terraform output -json vpc_cidr_block`
        )
      ).stdout
    );

    // Create variables file for EKS
    console.log('Creating eks.auto.tfvars.json');
    await fs.writeFile(
      path.join(clusterPath, 'eks.auto.tfvars.json'),
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
    console.log('Connecting to aws');
    await execAsync(
      `aws --profile default configure set aws_access_key_id ${awsAccessKey}`
    );
    await execAsync(
      `aws --profile default configure set aws_secret_access_key ${awsSecretKey}`
    );
    await execAsync(`aws --profile default configure set region ${vpcRegion}`);

    // Apply the Terraform files to provision a cluster
    console.log('Applying terraform configuration');
    const output = await execAsync(
      `cd ${clusterPath} && terraform init && terraform apply --auto-approve`
    );
    console.log('output:', output);

    // Get volume handle (EFS ID)
    console.log('Getting volume handle (EFS ID)');
    const volumeHandle = await execAsync(
      `cd ${clusterPath} && terraform output -json efs-id`,
      { encoding: 'utf8' }
    );
    res.locals.data = { awsClusterName, volumeHandle };

    // Connect kubectl to EKS cluster via aws
    console.log('Connecting kubectl');
    await execAsync(
      `aws eks update-kubeconfig --region ${vpcRegion} --name ${awsClusterName}`
    );

    // Deploy nginx controller
    console.log('Deploying nginx controller');
    await execAsync(
      `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/aws/deploy.yaml`
    );

    // Log success and continue
    console.log('Done');
    return next();
  } catch (err) {
    return next({
      log: `Error in deploymentController.addCluster: ${err}`,
      message: { err: 'An error occurred trying to create a cluster' },
    });
  }
};

// @ts-expect-error TS(2339) FIXME: Property 'deleteCluster' does not exist on type '{... Remove this comment to see the full error message
deploymentController.deleteCluster = async (req: any, res: any, next: any) => {
  console.log('\n/api/deployment/deleteCluster:');
  const { userId, projectId, clusterId } = req.body;
  const clusterPath = path.join(
    'server',
    'terraform',
    'userData',
    `user${userId}`,
    `project${projectId}`,
    `cluster${clusterId}`
  );

  try {
    // Destroy the cluster
    console.log('Destroying cluster');
    await execAsync(`cd ${clusterPath} && terraform destroy --auto-approve`);

    // Remove cluster directory
    console.log('Removing cluster directory');
    await fs.rm(clusterPath, { recursive: true });

    // Log success and continue
    console.log('Done');
    return next();
  } catch (err) {
    return next({
      log: `Error in deleteCluster: ${err}`,
      message: { err: 'An error occurred trying to delete a cluster' },
    });
  }
};

// Use AWS CodeBuild to dockerize GitHub repo and push to AWS ECR
// @ts-expect-error TS(2339) FIXME: Property 'buildImageNEW' does not exist on type '{... Remove this comment to see the full error message
deploymentController.buildImageNEW = async (req: any, res: any, next: any) => {
  console.log('\n/api/deployment/buildImage:');
  const { repo, branch, awsAccessKey, awsSecretKey, vpcRegion } = req.body;
  const githubToken = req.cookies.github_token; // GitHub token

  const repoName = repo.split('/').pop(); // Extract repo name from "user/repoName"
  const awsRepoName = repoName.toLowerCase(); // ECR repository name
  const imageTag = 'latest'; // Hardcoded image tag
  const projectName = `${awsRepoName}-${branch}`; // CodeBuild project name

  try {
    // Configure AWS
    console.log("Configuring AWS")
    const awsConfig = {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretKey,
      region: vpcRegion,
    };
    AWS.config.update(awsConfig);
    const ecr = new AWS.ECR();
    const codebuild = new AWS.CodeBuild();
    const iam = new AWS.IAM();

    // Configure CodeBuild Service Role
    console.log("Configuring CodeBuild Service Role");
    async function ensureCodeBuildServiceRole() {
      const roleName = 'MyCodeBuildServiceRole';
      const sts = new AWS.STS();

      // Retrieve the AWS account ID
      const accountIdData = await sts.getCallerIdentity({}).promise();
      const awsAccountId = accountIdData.Account;

      const assumeRolePolicyDocument = JSON.stringify({
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: {
            Service: 'codebuild.amazonaws.com'
          },
          Action: 'sts:AssumeRole'
        }]
      });

      try {
        // Check if role exists
        await iam.getRole({ RoleName: roleName }).promise();
        console.log('Role already exists');
      } catch (error) {
        // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
        if (error.code === 'NoSuchEntity') {
          // Role does not exist, create it
          console.log('Creating role');
          await iam.createRole({
            RoleName: roleName,
            AssumeRolePolicyDocument: assumeRolePolicyDocument,
          }).promise();

          // Attach policies to the role
          await iam.attachRolePolicy({
            RoleName: roleName,
            PolicyArn: 'arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess',
          }).promise();

          // Attach the CloudWatchLogs policy
          const cloudWatchPolicy = {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: [
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:PutLogEvents"
                ],
                Resource: `arn:aws:logs:${vpcRegion}:${awsAccountId}:log-group:/aws/codebuild/${projectName}:*`
              }
            ]
          };

          await iam.putRolePolicy({
            RoleName: roleName,
            PolicyName: 'CodeBuildCloudWatchLogsPolicy',
            PolicyDocument: JSON.stringify(cloudWatchPolicy)
          }).promise();
        } else {
          // Other errors
          throw error;
        }
      }

      return `arn:aws:iam::${awsAccountId}:role/${roleName}`;
    }
    const serviceRoleArn = await ensureCodeBuildServiceRole();

    // Create ECR repository
    console.log('Creating ECR repository');
    await ecr.createRepository({ repositoryName: awsRepoName }).promise().catch((err: any) => {
      if (err.code !== 'RepositoryAlreadyExistsException') {
        throw err;
      }
    });

    // Get ECR repository URI
    const { repositories } = await ecr.describeRepositories({ repositoryNames: [awsRepoName] }).promise();
    const repositoryUri = repositories[0].repositoryUri;

    // Define CodeBuild project
    const buildProjectParams = {
      name: projectName,
      source: {
        type: 'GITHUB',
        location: `https://github.com/${repo}.git`,
        auth: {
          type: 'OAUTH',
          resource: githubToken,
        },
        buildspec: `
          version: 0.2
          phases:
            pre_build:
              commands:
                - echo Logging in to Amazon ECR...
                - $(aws ecr get-login --no-include-email)
            build:
              commands:
                - echo Building the Docker image...
                - docker build -t ${repositoryUri}:${imageTag} .
            post_build:
              commands:
                - echo Pushing the Docker image...
                - docker push ${repositoryUri}:${imageTag}
        `,
      },
      artifacts: {
        type: 'NO_ARTIFACTS',
      },
      environment: {
        type: 'LINUX_CONTAINER',
        image: 'aws/codebuild/standard:4.0', // this base image has Docker access. update as needed
        computeType: 'BUILD_GENERAL1_SMALL',
      },
      serviceRole: serviceRoleArn,
    };

    // Create or update CodeBuild project
    console.log('Creating or updating CodeBuild project');
    try {
      // Attempt to create the CodeBuild project
      await codebuild.createProject(buildProjectParams).promise();
    } catch (error) {
      // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
      if (error.code === 'ResourceAlreadyExistsException') {
        // If project already exists, update it
        console.log('Project already exists, updating existing project');
        await codebuild.updateProject(buildProjectParams).promise();
      } else {
        // If other error, throw it
        throw error;
      }
    }

    // Start build
    console.log('Starting build in CodeBuild');
    const buildStartParams = {
      projectName: projectName,
      sourceVersion: branch, // Specify the branch
    };
    await codebuild.startBuild(buildStartParams).promise();

    // Set response data
    res.locals.data = { awsRepo: projectName, imageName: repositoryUri, imageTag };

    // Log success and continue
    console.log('Done');
    return next();
  } catch (err) {
    return next({
      log: `Error in buildImage: ${err}`,
      message: { err: 'An error occurred trying to build an image' },
    });
  }
};

// OLD: Dockerize github repo and push to AWS ECR
// @ts-expect-error TS(2339) FIXME: Property 'buildImage' does not exist on type '{}'.
deploymentController.buildImage = async (req: any, res: any, next: any) => {
  console.log('\n/api/deployment/buildImage:');
  const { repo, branch, awsAccessKey, awsSecretKey, vpcRegion } = req.body;

  const awsRepo = repo.split('/').join('-').toLowerCase(); // format: "githubUser-repoName"
  const imageName = repo.split('/').join('-').toLowerCase() + `-${branch}`; // format: "githubUser-repoName-branch"

  try {
    // Connect to AWS
    console.log('Connecting to aws');
    await execAsync(
      `aws --profile default configure set aws_access_key_id ${awsAccessKey}`
    );
    await execAsync(
      `aws --profile default configure set aws_secret_access_key ${awsSecretKey}`
    );
    await execAsync(`aws --profile default configure set region ${vpcRegion}`);

    // Get AWS account ID
    console.log('Getting AWS account ID');
    const awsAccountId = JSON.parse(
      (
        await execAsync(`aws sts get-caller-identity`, {
          encoding: 'utf8',
        })
      ).stdout
    ).Account;

    // Create ECR repository for pod
    console.log('Creating ECR repository');
    const ecrUrl = `${awsAccountId}.dkr.ecr.${vpcRegion}.amazonaws.com`;
    await execAsync(
      `aws ecr get-login-password --region ${vpcRegion} | docker login --username AWS --password-stdin ${ecrUrl}`
    );
    await execAsync(
      `aws ecr create-repository --repository-name ${awsRepo} --region ${vpcRegion} || true`
    );

    // Dockerize and push image to ECR repository
    console.log('Dockerizing and pushing image to ECR repository');
    const cloneUrl = `https://github.com/${repo}.git#${branch}`;
    const imageUrl = `${ecrUrl}/${awsRepo}`;
    // await execAsync(`docker build -t ${imageName} ${cloneUrl}`);
    await execAsync(
      `docker buildx build --platform linux/amd64 -t ${imageName} ${cloneUrl} --load`
    );
    await execAsync(`docker tag ${imageName} ${imageUrl}`);
    await execAsync(`docker push ${imageUrl}`);

    // Log success and continue
    console.log('Done');
    res.locals.data = { awsRepo, imageName: imageUrl, imageTag: 'latest' };
    return next();
  } catch (err) {
    return next({
      log: `Error in buildImage: ${err}`,
      message: { err: 'An error occurred trying to build an image' },
    });
  }
};

// @ts-expect-error TS(2339) FIXME: Property 'deleteImageNew' does not exist on type '... Remove this comment to see the full error message
deploymentController.deleteImageNew = async (req: any, res: any, next: any) => {
  console.log('\n/api/deployment/deleteImage:');
  const {
    awsAccessKey,
    awsSecretKey,
    vpcRegion,
    awsRepo,
    imageTag, // imageName is not needed for deleting the image
  } = req.body;

  try {
    // Configure AWS
    console.log('Configuring AWS');
    AWS.config.update({
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretKey,
      region: vpcRegion
    });

    // Create ECR client
    const ecr = new AWS.ECR();

    // Delete image
    console.log('Deleting image');
    await ecr.batchDeleteImage({
      repositoryName: awsRepo,
      imageIds: [{ imageTag: imageTag }]
    }).promise();

    // Log success and continue
    console.log('Image deleted successfully');
    return next();
  } catch (err) {
    console.error('Error in deleteImage:', err);
    return next({
      log: `Error in deleteImage: ${err}`,
      message: { err: 'An error occurred trying to delete an image' },
    });
  }
};

// @ts-expect-error TS(2339) FIXME: Property 'deleteImage' does not exist on type '{}'... Remove this comment to see the full error message
deploymentController.deleteImage = async (req: any, res: any, next: any) => {
  console.log('\n/api/deployment/deleteImage:');
  const {
    awsAccessKey,
    awsSecretKey,
    vpcRegion,
    awsRepo,
    imageName,
    imageTag,
  } = req.body;

  try {
    // Connect to AWS
    console.log('Connecting to aws');
    await execAsync(
      `aws --profile default configure set aws_access_key_id ${awsAccessKey}`
    );
    await execAsync(
      `aws --profile default configure set aws_secret_access_key ${awsSecretKey}`
    );
    await execAsync(`aws --profile default configure set region ${vpcRegion}`);

    // Delete image
    console.log('Deleting image');
    await execAsync(
      `aws ecr batch-delete-image --repository-name ${awsRepo} --image-ids imageTag=${imageTag} --region ${vpcRegion}`
    );

    // Log success and continue
    console.log('Done');
    return next();
  } catch (err) {
    return next({
      log: `Error in deleteImage: ${err}`,
      message: { err: 'An error occurred trying to delete an image' },
    });
  }
};

// @ts-expect-error TS(2339) FIXME: Property 'deployPod' does not exist on type '{}'.
deploymentController.deployPod = async (req: any, res: any, next: any) => {
  console.log('\n/api/deployment/deployPod:');
  const { awsAccessKey, awsSecretKey, vpcRegion, awsClusterName, yaml } =
    req.body;

  try {
    // Connect to aws via command line
    console.log('Connecting to aws');
    await execAsync(
      `aws --profile default configure set aws_access_key_id ${awsAccessKey}`
    );
    await execAsync(
      `aws --profile default configure set aws_secret_access_key ${awsSecretKey}`
    );
    await execAsync(`aws --profile default configure set region ${vpcRegion}`);

    // Connect kubectl to EKS cluster via aws
    console.log('Connecting kubectl');
    await execAsync(
      `aws eks update-kubeconfig --region ${vpcRegion} --name ${awsClusterName}`
    );

    // Apply yaml (deploys pod)
    const output = await execAsync(`echo "${yaml}" | kubectl apply -f -`, {
      encoding: 'utf8',
    });
    console.log(output);

    // Log success and continue
    console.log('Done');
    return next();
  } catch (err) {
    return next({
      log: `Error in deployPod: ${err}`,
      message: { err: 'An error occurred trying to deploy a pod' },
    });
  }
};

// @ts-expect-error TS(2339) FIXME: Property 'deletePod' does not exist on type '{}'.
deploymentController.deletePod = async (req: any, res: any, next: any) => {
  console.log('\n/api/deployment/deletePod:');
  const { vpcRegion, awsAccessKey, awsSecretKey, awsClusterName, podName } =
    req.body;

  try {
    // Connect to AWS
    console.log('Connecting to aws');
    await execAsync(
      `aws --profile default configure set aws_access_key_id ${awsAccessKey}`
    );
    await execAsync(
      `aws --profile default configure set aws_secret_access_key ${awsSecretKey}`
    );
    await execAsync(`aws --profile default configure set region ${vpcRegion}`);

    // Connect kubectl to EKS cluster via aws
    console.log('Connecting kubectl');
    await execAsync(
      `aws eks update-kubeconfig --region ${vpcRegion} --name ${awsClusterName}`
    );

    // Delete deployment
    await execAsync(`kubectl delete 'deployment' ${podName}`);

    // Log success and continue
    console.log('Done');
    return next();
  } catch (err) {
    return next({
      log: `Error in deletePod: ${err}`,
      message: { err: 'An error occurred trying to delete a pod' },
    });
  }
};

// @ts-expect-error TS(2339) FIXME: Property 'getURL' does not exist on type '{}'.
deploymentController.getURL = async (req: any, res: any, next: any) => {
  console.log('\n/api/deployment/getURL:');
  const { awsAccessKey, awsSecretKey, vpcRegion, awsClusterName } = req.body;

  try {
    // Connect to AWS
    console.log('Connecting to aws');
    await execAsync(
      `aws --profile default configure set aws_access_key_id ${awsAccessKey}`
    );
    await execAsync(
      `aws --profile default configure set aws_secret_access_key ${awsSecretKey}`
    );
    await execAsync(`aws --profile default configure set region ${vpcRegion}`);

    // Connect kubectl to EKS cluster via aws
    console.log('Connecting kubectl');
    await execAsync(
      `aws eks update-kubeconfig --region ${vpcRegion} --name ${awsClusterName}`
    );

    // Get public ingress URL
    console.log('Getting public ingress URL');
    let attempts = 0;
    const checkURL = async () => {
      const url = (
        await execAsync(
          `kubectl get ingress -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}'`,
          { encoding: 'utf8' }
        )
      ).stdout;
      if (url) {
        console.log('URL:', url);
        res.locals.data = { url };

        // Log success and continue
        console.log('Done');
        return next();
      } else {
        if (attempts++ < 100) setTimeout(checkURL, 1000);
        else console.log('Exceeded 100 attempts to get URL');
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
