import YAML from 'yaml';
import { Buffer } from 'buffer';

const createYaml = {};

// @ts-expect-error TS(2339) FIXME: Property 'deployment' does not exist on type '{}'.
createYaml.deployment = (
  name: any,
  imageName: any,
  imageTag: any,
  replicas: any,
  exposedPort: any,
  variables = null,
  volume = null
) => {
  const deploymentConfig = {
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
      // @ts-expect-error TS(2322) FIXME: Type 'string' is not assignable to type 'never'.
      name: name + '-volume',
      // @ts-expect-error TS(2322) FIXME: Type 'any' is not assignable to type 'never'.
      mountPath: volume.mountPath || '/var/lib/' + name + '/data/',
    });
    deploymentConfig.spec.template.spec.volumes.push({
      // @ts-expect-error TS(2322) FIXME: Type 'string' is not assignable to type 'never'.
      name: name + '-volume',
      // @ts-expect-error TS(2322) FIXME: Type 'string' is not assignable to type 'never'.
      persistentVolumeClaim: { claimName: name + '-pvc' },
    });
  }

  if (variables) {
    // @ts-expect-error TS(2339) FIXME: Property 'data' does not exist on type 'never'.
    const configMapData = variables.data.variables
      .filter((item: any) => !item.secret)
      .reduce((acc: any, item: any) => {
        acc.name = item.key;
        acc.valueFrom = {
          configMapKeyRef: {
            name: name + '-config',
            key: item.key,
          },
        };
        return acc;
      }, {});

    if (Object.keys(configMapData).length) {
      // @ts-expect-error TS(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
      deploymentConfig.spec.template.spec.containers[0].env.push(configMapData);
    }

    // @ts-expect-error TS(2339) FIXME: Property 'data' does not exist on type 'never'.
    const secretData = variables.data.variables
      .filter((item: any) => item.secret)
      .reduce((acc: any, item: any) => {
        acc.name = item.key;
        acc.valueFrom = {
          secretKeyRef: {
            name: name + '-secret',
            key: item.key,
          },
        };
        return acc;
      }, {});

    if (Object.keys(secretData).length) {
      // @ts-expect-error TS(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
      deploymentConfig.spec.template.spec.containers[0].env.push(secretData);
    }
  }

  return YAML.stringify(deploymentConfig);
};

// @ts-expect-error TS(2339) FIXME: Property 'service' does not exist on type '{}'.
createYaml.service = (name: any, exposedPort: any, port = 80) => {
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
};

// @ts-expect-error TS(2339) FIXME: Property 'ingress' does not exist on type '{}'.
createYaml.ingress = (name: any, port = 80) => {
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
};

// @ts-expect-error TS(2339) FIXME: Property 'configMap' does not exist on type '{}'.
createYaml.configMap = (name: any, variables: any) => {
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
};

// @ts-expect-error TS(2339) FIXME: Property 'secret' does not exist on type '{}'.
createYaml.secret = (name: any, variables: any) => {
  const secretData = variables.data.variables
    .filter((item: any) => item.secret)
    .reduce((acc: any, item: any) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

  // Base64-encode all values in the data object
  const encodedData = {};
  for (const [key, value] of Object.entries(secretData)) {
    // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    encodedData[key] = Buffer.from(value).toString('base64');
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
};

// @ts-expect-error TS(2339) FIXME: Property 'persistentVolume' does not exist on type... Remove this comment to see the full error message
createYaml.persistentVolume = (
  name: any,
  volumeHandle: any,
  storage = '10Gi',
  accessModes = ['ReadWriteMany']
) => {
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
};

// @ts-expect-error TS(2339) FIXME: Property 'persistentVolumeClaim' does not exist on... Remove this comment to see the full error message
createYaml.persistentVolumeClaim = (
  name: any,
  storage = '1Gi',
  accessModes = ['ReadWriteMany']
) => {
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
};

// @ts-expect-error TS(2339) FIXME: Property 'storageClass' does not exist on type '{}... Remove this comment to see the full error message
createYaml.storageClass = (name: any, volumeHandle: any, vpcRegion: any) => {
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
};

// @ts-expect-error TS(2339) FIXME: Property 'all' does not exist on type '{}'.
createYaml.all = (
  data: any,
  connectedNodes: any,
  exposedPort: any,
  volumeHandle: any,
  vpcRegion: any
) => {
  const yamlArr = [];

  const name = data.name.replace(/[^A-Z0-9]/gi, '_').toLowerCase();
  const imageName = data.imageName;
  const imageTag = data.imageTag;
  const replicas = data.replicas;
  const ingress = connectedNodes.find((node: any) => node.type === 'ingress');
  const port = ingress?.data.port || '80';
  const variables = connectedNodes.find((node: any) => node.type === 'variables');
  const configMapData = variables?.data.variables.filter(
    (item: any) => !item.secret
  );
  const secretData = variables?.data.variables.filter((item: any) => item.secret);
  const volume = connectedNodes.find((node: any) => node.type === 'volume');

  yamlArr.push(
    // @ts-expect-error TS(2339) FIXME: Property 'deployment' does not exist on type '{}'.
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
  // @ts-expect-error TS(2339) FIXME: Property 'service' does not exist on type '{}'.
  yamlArr.push(createYaml.service(name, exposedPort, port));
  // @ts-expect-error TS(2339) FIXME: Property 'ingress' does not exist on type '{}'.
  if (ingress) yamlArr.push(createYaml.ingress(name, port));
  // @ts-expect-error TS(2339) FIXME: Property 'configMap' does not exist on type '{}'.
  if (configMapData?.length) yamlArr.push(createYaml.configMap(name, variables));
  // @ts-expect-error TS(2339) FIXME: Property 'secret' does not exist on type '{}'.
  if (secretData?.length) yamlArr.push(createYaml.secret(name, variables));
  // @ts-expect-error TS(2339) FIXME: Property 'persistentVolume' does not exist on type... Remove this comment to see the full error message
  if (volume) yamlArr.push(createYaml.persistentVolume(name, volumeHandle));
  // @ts-expect-error TS(2339) FIXME: Property 'persistentVolumeClaim' does not exist on... Remove this comment to see the full error message
  if (volume) yamlArr.push(createYaml.persistentVolumeClaim(name));
  if (volume)
    // @ts-expect-error TS(2339) FIXME: Property 'storageClass' does not exist on type '{}... Remove this comment to see the full error message
    yamlArr.push(createYaml.storageClass(name, volumeHandle, vpcRegion));

  return yamlArr.join('\n---\n\n');
};

export default createYaml;
