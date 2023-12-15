const awsEcrController = {};
require('dotenv').config();

// access credentials to access AWS ECR
// must have AdministratorAccess for IAM user to use. 

// we also need the account id

const AWS_ECR_ACCESS_KEY = process.env.AWS_ECR_ACCESS_KEY;
const AWS_ECR_SECRET_ACCESS_KEY = process.env.AWS_ECR_SECRET_ACCESS_KEY;
const AWS_ECR_REGION = process.env.AWS_ECR_REGION;

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;

awsEcrController.repositoryMaker = (req, res, next) => {

  // from the post request would need to declare what the new repo would be called
  const repoName = req.body.repoName;
  const Name_of_the_image = req.body.imageName;
  const the_git_repo = req.body.githuburl;

  // for signing in:
    // This came from Dennis and may not be needed up until region if already signed in
  execSync(
    `aws --profile default configure set aws_access_key_id ${AWS_ECR_ACCESS_KEY}`
  );
  execSync(
    `aws --profile default configure set aws_secret_access_key_id ${AWS_ECR_SECRET_ACCESS_KEY}`
  );
  execSync(`aws --profile default configure set region ${AWS_ECR_REGION}`);

  // new code -- creating the repository in ECR

  execSync(`aws ecr get-login-password --region ${AWS_ECR_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_ECR_REGION}.amazonaws.com`
  );
  execSync(`aws ecr create-repository --repository-name ${repoName} --region ${AWS_ECR_REGION}`);

  // this creates an image and pushes it

  execSync(`docker build -t ${Name_of_the_image} ${the_git_repo}`);
  execSync(`docker tag ${Name_of_the_image} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_ECR_REGION}.amazonaws.com/${repoName}`);
  execSync(`docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_ECR_REGION}.amazonaws.com/${repoName}`);

};

awsEcrController.imagePusher = (req, res, next) => {

};

awsEcrController.repositoryDestroyer = (req, res, next) => {

  // would need the name of the repositry

  // the --force deletes all images inside as well

  execSync(`aws ecr delete-repository --repository-name ${repoName} --force --region ${AWS_ECR_REGION}`);

};

module.exports = awsEcrController;