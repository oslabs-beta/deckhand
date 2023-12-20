import YAML from 'yaml';
import { Buffer } from 'buffer';

const createYaml = {};

createYaml.deployment = (name, imageName, imageTag, replicas, exposedPort, variables = null, volume = null) => {
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
              containerPort: exposedPort,
            }],
            volumeMounts: [],
            env: [],
          }],
          volumes: [],
        }
      },
    }
  };

  if (volume) {
    deploymentConfig.spec.template.spec.containers[0].volumeMounts.push({
      name: name + '-volume',
      mountPath: volume.mountPath || '/var/lib/' + name + '/data/',
    })
    deploymentConfig.spec.template.spec.volumes.push({
      name: name + '-volume',
      persistentVolumeClaim: { claimName: name + '-pvc' }
    })
  }

  if (variables) {
    const configMapData = variables.data.variables
      .filter(item => !item.secret)
      .reduce((acc, item) => {
        acc.name = item.key;
        acc.valueFrom = {
          configMapKeyRef: {
            name: name + '-config',
            key: item.key,
          }
        }
        return acc;
      }, {});

    if (Object.keys(configMapData).length) {
      deploymentConfig.spec.template.spec.containers[0].env.push(configMapData)
    }

    const secretData = variables.data.variables
      .filter(item => item.secret)
      .reduce((acc, item) => {
        acc.name = item.key;
        acc.valueFrom = {
          secretKeyRef: {
            name: name + '-secret',
            key: item.key,
          }
        }
        return acc;
      }, {});

    if (Object.keys(secretData).length) {
      deploymentConfig.spec.template.spec.containers[0].env.push(secretData)
    }
  }

  return YAML.stringify(deploymentConfig);
};

createYaml.service = (name, exposedPort, port = 80) => {
  const serviceConfig = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: name + '-service'
    },
    spec: {
      type: 'ClusterIP',
      ports: [{
        protocol: 'TCP',
        port: port,
        targetPort: exposedPort
      }],
      selector: {
        app: name,
      }
    }
  };

  return YAML.stringify(serviceConfig);
};

createYaml.ingress = (name, port = 80) => {
  return YAML.stringify({
    apiVersion: 'networking.k8s.io/v1',
    kind: 'Ingress',
    metadata: {
      name: name + '-ingress',
      annotations: {
        'kubernetes.io/ingress.class': 'nginx',
      }
    },
    spec: {
      rules: [{
        http: {
          paths: [{
            path: '/',
            pathType: 'Prefix',
            backend: {
              service: {
                name: name + '-service',
                port: {
                  number: port
                }
              }
            }
          }]
        }
      }]
    }
  });
};

createYaml.configMap = (name, variables) => {
  const configMapData = variables.data.variables
    .filter(item => !item.secret)
    .reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

  return YAML.stringify({
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {
      name: name + '-config'
    },
    data: configMapData
  });
};

createYaml.secret = (name, variables) => {
  const secretData = variables.data.variables
    .filter(item => item.secret)
    .reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

  // Base64-encode all values in the data object
  const encodedData = {};
  for (const [key, value] of Object.entries(secretData)) {
    encodedData[key] = Buffer.from(value).toString('base64');
  }

  return YAML.stringify({
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name: name + '-secret'
    },
    type: 'Opaque', // Change this as needed for different types of secrets
    data: encodedData
  });
};

createYaml.persistentVolume = (name, volumeHandle, storage = '10Gi', accessModes = ['ReadWriteMany']) => {
  const pvConfig = {
    apiVersion: 'v1',
    kind: 'PersistentVolume',
    metadata: {
      name: name + '-pv'
    },
    spec: {
      capacity: {
        storage: storage
      },
      volumeMode: 'Filesystem',
      accessModes: accessModes,
      persistentVolumeReclaimPolicy: 'Retain',
      storageClassName: name + '-sc',
      csi: {
        driver: 'efs.csi.aws.com',
        volumeHandle: volumeHandle,
      }
    },
  };

  return YAML.stringify(pvConfig);
};

createYaml.persistentVolumeClaim = (name, storage = '1Gi', accessModes = ['ReadWriteMany']) => {
  const pvConfig = {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      name: name + '-pvc'
    },
    spec: {
      accessModes: accessModes,
      storageClassName: name + '-sc',
      resources: {
        requests: {
          storage: storage,
        }
      }
    },
  };

  return YAML.stringify(pvConfig);
};

createYaml.storageClass = (name, volumeHandle, vpcRegion) => {
  const pvConfig = {
    apiVersion: 'storage.k8s.io/v1',
    kind: 'StorageClass',
    metadata: {
      name: name + '-sc'
    },
    provisioner: 'efs.csi.aws.com',
    parameters: {
      provisioningMode: 'efs-ap',
      fileSystemId: volumeHandle,
      region: vpcRegion,
      directoryPermms: '777',
    }
  };

  return YAML.stringify(pvConfig);
};

createYaml.all = (data, connectedNodes, exposedPort, volumeHandle, vpcRegion) => {
  const yamlArr = [];

  const name = data.name.replace(/[^A-Z0-9]/gi, "_").toLowerCase();
  const imageName = data.imageName;
  const imageTag = data.imageTag;
  const replicas = data.replicas;
  const ingress = connectedNodes.find((node) => node.type === "ingress")
  const port = ingress.port || '80'
  const variables = connectedNodes.find((node) => node.type === "variables")
  const configMapData = variables.data.variables.filter(item => !item.secret)
  const secretData = variables.data.variables.filter(item => item.secret)
  const volume = connectedNodes.find((node) => node.type === "volume")

  yamlArr.push(createYaml.deployment(name, imageName, imageTag, replicas, exposedPort, variables, volume))
  yamlArr.push(createYaml.service(name, exposedPort, port))
  if (ingress) yamlArr.push(createYaml.ingress(name, port))
  if (configMapData.length) yamlArr.push(createYaml.configMap(name, variables))
  if (secretData.length) yamlArr.push(createYaml.secret(name, variables))
  if (volume) yamlArr.push(createYaml.persistentVolume(name, volumeHandle))
  if (volume) yamlArr.push(createYaml.persistentVolumeClaim(name))
  if (volume) yamlArr.push(createYaml.storageClass(name, volumeHandle, vpcRegion))

  return yamlArr.join('\n---\n\n');
};

export default createYaml;