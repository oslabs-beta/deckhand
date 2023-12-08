const { exec, execSync } = require('child_process');

// connects the aws command in the server's terminal to user's aws account
const connectCLtoAWS = (accessKey, secretKey, region) => {
  execSync(
    `aws --profile default configure set aws_access_key_id ${accessKey}`
  );
  execSync(
    `aws --profile default configure set aws_secret_access_key_id ${secretKey}`
  );
  execSync(`aws --profile default configure set region ${region}`);
};

// connects the kubectl command in the server's terminal to user's eks cluster
// for this to work, aws must already be connect to terminal
const connectKubectltoEKS = (region, clusterName) => {
  execSync(
    `aws eks update-kubeconfig --region ${region} --name ${clusterName}`
  );
};

// Testing
// connectCLtoAWS(
//   process.env.AWS_ACCESS_KEY,
//   process.env.AWS_SECRET_KEY,
//   'us-east-1'
// );

// connectKubectltoEKS('us-east-1', 'dec7cluster3');

const deploy = (yamls) => {};

module.exports = { connectCLtoAWS, connectKubectltoEKS };
