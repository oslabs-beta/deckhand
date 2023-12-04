const YAML = require('yaml');

const createYaml = {};

createYaml.deployment = (name, imageName, imageTag, replicas, port) => {
  const deploymentConfig = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: name
    },
    spec: {
      replicas: replicas,
      selector: {
        matchLabels: {
          app: name
        }
      },
      template: {
        metadata: {
          labels: {
            app: name
          }
        },
        spec: {
          containers: [{
            name: name,
            image: `${imageName}:${imageTag}`,
            ports: [{
              containerPort: port
            }]
          }]
        }
      }
    }
  };

  return YAML.stringify(deploymentConfig);
};

// Example usage
// const deploymentYAML = createYaml.deployment('my-app', 'mydockerhubuser/myimage', 'latest', 3, 8080);
// console.log(deploymentYAML);

createYaml.ingress = (name, host, path, serviceName, servicePort) => {
  return YAML.stringify({
    apiVersion: 'networking.k8s.io/v1',
    kind: 'Ingress',
    metadata: {
      name: name
    },
    spec: {
      rules: [{
        host: host,
        http: {
          paths: [{
            path: path,
            pathType: 'Prefix',
            backend: {
              service: {
                name: serviceName,
                port: {
                  number: servicePort
                }
              }
            }
          }]
        }
      }]
    }
  });
};

// Example usage
// const ingressYAML = createYaml.ingress('my-ingress', 'example.com', '/path', 'my-service', 80);
// console.log(ingressYAML);

createYaml.configMap = (name, data) => {
  return YAML.stringify({
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {
      name: name
    },
    data: data
  });
};

// Example usage
// const data = {
//   'key1': 'value1',
//   'key2': 'value2'
// };
// const configMapYAML = createYaml.configMap('my-configmap', data);
// console.log(configMapYAML);

createYaml.secret = (name, data) => {
  // Base64-encode all values in the data object
  const encodedData = {};
  for (const [key, value] of Object.entries(data)) {
    encodedData[key] = Buffer.from(value).toString('base64');
  }

  return YAML.stringify({
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name: name
    },
    type: 'Opaque', // Change this as needed for different types of secrets
    data: encodedData
  });
};

// Example usage
// const secretData = {
//   'username': 'admin',
//   'password': 'secretPassword'
// };
// const secretYAML = createYaml.secret('my-secret', secretData);
// console.log(secretYAML);

createYaml.persistentVolume = (name, storage, storageClassName, accessModes, hostPath) => {
  const pvConfig = {
    apiVersion: 'v1',
    kind: 'PersistentVolume',
    metadata: {
      name: name
    },
    spec: {
      capacity: {
        storage: storage
      },
      volumeMode: 'Filesystem',
      accessModes: accessModes,
      persistentVolumeReclaimPolicy: 'Retain',
      storageClassName: storageClassName,
      hostPath: {
        path: hostPath
      }
    }
  };

  return YAML.stringify(pvConfig);
};

// Example usage
// const pvYAML = createYaml.persistentVolume('my-pv', '10Gi', 'standard', ['ReadWriteOnce'], '/mnt/data');
// console.log(pvYAML);

module.exports = createYaml;
