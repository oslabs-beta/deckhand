const { exec, execSync } = require('child_process');

// function to connect server's terminal to user's aws
const connectCLtoAWS = (accessKey, secretKey, region) => {
  execSync(
    `aws --profile default configure set aws_access_key_id ${accessKey}`
  );
  execSync(
    `aws --profile default configure set aws_secret_access_key_id ${secretKey}`
  );
  execSync(`aws --profile default configure set region ${region}`);
};

module.exports = { connectCLtoAWS };
