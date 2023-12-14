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

// deploys each yaml string in the input array
const deploy = (yamls) => {
  yamls.forEach((yaml) => {
    execSync(`echo ${yaml} | kubectl apply -f -`);
  });
};

// removes the component from the cluster
const remove = (kind, name) => {
  execSync(`kubectl delete ${kind} ${name}`);
};

module.exports = { connectCLtoAWS, connectKubectltoEKS, deploy, remove };

// Testing
connectKubectltoEKS('us-east-1', 'dec14_1');
deploy([
  `apiVersion: apps/v1
kind: Deployment
metadata:
  name: dennis
  labels:
    app: dennis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: dennis
  template:
    metadata:
      labels:
        app: dennis
    spec:
      containers:
        - name: dennis
          image: nginx
          ports:
            - containerPort: 3000
`,
]);
