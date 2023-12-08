import YAML from 'yaml';
import { Buffer } from 'buffer';

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

createYaml.service = (name, type, port, targetPort, selector) => {
  const serviceConfig = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: name
    },
    spec: {
      type: type,
      ports: [{
        port: port,
        targetPort: targetPort
      }],
      selector: selector
    }
  };

  return YAML.stringify(serviceConfig);
};

// Example usage
// const serviceYAML = createYaml.service('my-service', 'ClusterIP', 80, 8080, { app: 'my-app' });
// console.log(serviceYAML);

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

createYaml.all = (pod) => {
  const yamlArr = [];

  const appName = pod.name.replace(/[^A-Z0-9]/gi, "_").toLowerCase();
  const imageName = pod.imageName;
  const imageTag = pod.imageTag;
  const replicas = pod.replicas;
  const serviceType = 'ClusterIP';
  const targetPort = 8080;
  const host = pod.host;
  const path = pod.path;
  const configMapData = pod.variables
    .filter(item => !item.secret)
    .reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  const secretData = pod.variables
    .filter(item => item.secret)
    .reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  const pvStorage = '10Gi';
  const storageClassName = 'standard';
  const accessModes = ['ReadWriteOnce'];
  const hostPath = pod.volume;

  yamlArr.push(createYaml.deployment(appName, imageName, imageTag, replicas, targetPort));
  yamlArr.push(createYaml.service(appName, serviceType, targetPort, targetPort, { app: appName }));
  if (host && path) yamlArr.push(createYaml.ingress(`${appName}-ingress`, host, path, appName, targetPort));
  if (Object.keys(configMapData).length) yamlArr.push(createYaml.configMap(`${appName}-config`, configMapData));
  if (Object.keys(secretData).length) yamlArr.push(createYaml.secret(`${appName}-secret`, secretData));
  if (hostPath) yamlArr.push(createYaml.persistentVolume(`${appName}-pv`, pvStorage, storageClassName, accessModes, hostPath));

  return yamlArr.join('\n---\n\n');
};

// Example usage
// const examplePod = {
//   id: 2,
//   name: 'Database',
//   type: 'docker-hub',
//   config: true,
//   imageName: 'mongo',
//   imageTag: 'latest',
//   replicas: 1,
//   variables: [{ key: 'user1', value: 'abc123', secret: true }, { key: 'PG_URI', value: 'db_address', secret: false }],
//   ingress: null,
//   volume: null, // directory string
//   deployed: false,
// }
// const completeYaml = createYaml.all(examplePod);
// console.log(completeYaml);

export default createYaml;