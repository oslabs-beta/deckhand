import YAML from 'yaml';
import { Buffer } from 'buffer';

interface Variable {
  secret: boolean;
  key: string;
  value?: string;
}

interface Variables {
  data: {
    variables: Variable[];
  };
}

interface Volume {
  mountPath?: string;
}

interface ConnectedNode {
  type: string;
  data: any;
}

const createYaml = {
  deployment: (
    name: string,
    imageName: string,
    imageTag: string,
    replicas: number,
    exposedPort: number,
    variables: Variables | null,
    volume: Volume | null
  ): string => {

    const deploymentConfig: any = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: name,
      },
      spec: {
        replicas: replicas,
        selector: {
          matchLabels: {
            app: name,
          },
        },
        template: {
          metadata: {
            labels: {
              app: name,
            },
          },
          spec: {
            containers: [
              {
                name: name,
                image: `${imageName}:${imageTag}`,
                ports: [
                  {
                    containerPort: exposedPort,
                  },
                ],
                volumeMounts: [],
                env: [],
              },
            ],
            volumes: [],
          },
        },
      },
    };

    if (volume) {
      deploymentConfig.spec.template.spec.containers[0].volumeMounts.push({
        name: `${name}-volume`,
        mountPath: volume.mountPath || `/var/lib/${name}/data/`,
      });
      deploymentConfig.spec.template.spec.volumes.push({
        name: `${name}-volume`,
        persistentVolumeClaim: { claimName: `${name}-pvc` },
      });
    }

    if (variables) {
      variables.data.variables.forEach((item) => {
        if (!item.secret) {
          deploymentConfig.spec.template.spec.containers[0].env.push({
            name: item.key,
            valueFrom: {
              configMapKeyRef: {
                name: `${name}-config`,
                key: item.key,
              },
            },
          });
        } else {
          deploymentConfig.spec.template.spec.containers[0].env.push({
            name: item.key,
            valueFrom: {
              secretKeyRef: {
                name: `${name}-secret`,
                key: item.key,
              },
            },
          });
        }
      });
    }

    return YAML.stringify(deploymentConfig);
  },

  service: (name: string, exposedPort: number, port: number = 80): string => {
  const serviceConfig = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: name + '-service',
    },
    spec: {
      type: 'ClusterIP',
      ports: [
        {
          protocol: 'TCP',
          port: port,
          targetPort: exposedPort,
        },
      ],
      selector: {
        app: name,
      },
    },
  };

  return YAML.stringify(serviceConfig);
  },

  ingress: (name: string, port: number = 80): string => {
  return YAML.stringify({
    apiVersion: 'networking.k8s.io/v1',
    kind: 'Ingress',
    metadata: {
      name: name + '-ingress',
      annotations: {
        'kubernetes.io/ingress.class': 'nginx',
      },
    },
    spec: {
      rules: [
        {
          http: {
            paths: [
              {
                path: '/',
                pathType: 'Prefix',
                backend: {
                  service: {
                    name: name + '-service',
                    port: {
                      number: port,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  });
  },

  configMap: (name: string, variables: Variables): string => {
  const configMapData = variables.data.variables
    .filter((item: any) => !item.secret)
    .reduce((acc: any, item: any) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

  return YAML.stringify({
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {
      name: name + '-config',
    },
    data: configMapData,
  });
  },

  secret: (name: string, variables: Variables): string => {
  const secretData = variables.data.variables
    .filter((item: any) => item.secret)
    .reduce((acc: any, item: any) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

  // Base64-encode all values in the data object
  const encodedData: any = {};
  for (const [key, value] of Object.entries(secretData)) {
    encodedData[key] = Buffer.from(value as string).toString('base64');
  }

  return YAML.stringify({
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name: name + '-secret',
    },
    type: 'Opaque', // Change this as needed for different types of secrets
    data: encodedData,
  });
  },

  persistentVolume: (
    name: string,
    volumeHandle: string,
    storage: string = '10Gi',
    accessModes: string[] = ['ReadWriteMany']
  ): string => {
  const pvConfig = {
    apiVersion: 'v1',
    kind: 'PersistentVolume',
    metadata: {
      name: name + '-pv',
    },
    spec: {
      capacity: {
        storage: storage,
      },
      volumeMode: 'Filesystem',
      accessModes: accessModes,
      persistentVolumeReclaimPolicy: 'Retain',
      storageClassName: name + '-sc',
      csi: {
        driver: 'efs.csi.aws.com',
        volumeHandle: volumeHandle,
      },
    },
  };

  return YAML.stringify(pvConfig);
  },

  persistentVolumeClaim: (
    name: string,
    storage: string = '1Gi',
    accessModes: string[] = ['ReadWriteMany']
  ): string => {
  const pvConfig = {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      name: name + '-pvc',
    },
    spec: {
      accessModes: accessModes,
      storageClassName: name + '-sc',
      resources: {
        requests: {
          storage: storage,
        },
      },
    },
  };

  return YAML.stringify(pvConfig);
  },

  storageClass: (name: string, volumeHandle: string, vpcRegion: string): string => {
  const pvConfig = {
    apiVersion: 'storage.k8s.io/v1',
    kind: 'StorageClass',
    metadata: {
      name: name + '-sc',
    },
    provisioner: 'efs.csi.aws.com',
    parameters: {
      provisioningMode: 'efs-ap',
      fileSystemId: volumeHandle,
      region: vpcRegion,
      directoryPerms: '777',
    },
  };

  return YAML.stringify(pvConfig);
  },

  all: (
    data: any,
    connectedNodes: ConnectedNode[],
    exposedPort: number,
    volumeHandle: string,
    vpcRegion: string
  ): string => {
    const yamlArr: any[] = [];

    const name = data.name.replace(/[^A-Z0-9]/gi, '_').toLowerCase();
    const imageName = data.imageName;
    const imageTag = data.imageTag;
    const replicas = data.replicas;
    const ingress = connectedNodes.find((node) => node.type === 'ingress');
    const port = ingress?.data.port || '80';
    const variables: any = connectedNodes.find((node) => node.type === 'variables');
    const configMapData = variables?.data.variables.filter(
      (item: any) => !item.secret
    );
    const secretData = variables?.data.variables.filter((item: any) => item.secret);
    const volume: any = connectedNodes.find((node) => node.type === 'volume');

    yamlArr.push(
      createYaml.deployment(
        name,
        imageName,
        imageTag,
        replicas,
        exposedPort,
        variables,
        volume
      )
    );
    yamlArr.push(createYaml.service(name, exposedPort, port));
    if (ingress) yamlArr.push(createYaml.ingress(name, port));
    if (configMapData?.length) yamlArr.push(createYaml.configMap(name, variables));
    if (secretData?.length) yamlArr.push(createYaml.secret(name, variables));
    if (volume) yamlArr.push(createYaml.persistentVolume(name, volumeHandle));
    if (volume) yamlArr.push(createYaml.persistentVolumeClaim(name));
    if (volume)
      yamlArr.push(createYaml.storageClass(name, volumeHandle, vpcRegion));

    return yamlArr.join('\n---\n\n');
  }
};

export default createYaml;
