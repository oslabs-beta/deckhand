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

module.exports = createYaml;
