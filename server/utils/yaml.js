const YAML = require('yaml');

const createYaml = {};

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

module.exports = createYaml;
