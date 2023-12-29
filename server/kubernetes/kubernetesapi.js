const { exec, execSync } = require('child_process');

// connects the aws command in the server's terminal to user's aws account
const connectCLtoAWS = (accessKey, secretKey, region) => {
  execSync(
    `aws --profile default configure set aws_access_key_id ${accessKey}`
  );
  execSync(
    `aws --profile default configure set aws_secret_access_key ${secretKey}`
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

// deploys the yaml string
const deploy = (yaml) => {
  // first deploy nginx controller
  execSync(
    `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/aws/deploy.yaml`
  );

  const output = execSync(`echo "${yaml}" | kubectl apply -f -`, {
    encoding: 'utf8',
  });
  console.log(output);
  return;
};

// removes the component from the cluster
const remove = (kind, name) => {
  execSync(`kubectl delete ${kind} ${name}`);
};

// get the public ingress url
// This will return an empty string if there is an ingress but the url is not ready yet
// This will return 'no ingress attached' if this cluster doesn't have an ingress
const getUrl = () => {
  try {
    const output = execSync(
      `kubectl get ingress -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}'`,
      { encoding: 'utf8' }
    );
    return output;
  } catch (err) {
    return 'no ingress attached';
  }
};

module.exports = {
  connectCLtoAWS,
  connectKubectltoEKS,
  deploy,
  remove,
  getUrl,
};
