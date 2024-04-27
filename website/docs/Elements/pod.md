---
sidebar_position: 3
---

# Pod

A Pod is the smallest deployable unit created and managed by Kubernetes. Each Pod represents a single instance of a running process in your cluster and can contain one or more containers. Containers within the same Pod share the same network IP, port space, and storage, allowing them to communicate efficiently. Pods are ephemeral by nature; they can be started, stopped, replicated, and deleted to manage application deployments and scale dynamically according to demand.

Pods are deployed within the clusters managed by Amazon Elastic Kubernetes Service (EKS) in AWS. Each pod can contain one or more containers based on the deployment specifications. The app ensures that the pods are scheduled on appropriate EC2 instances with sufficient resources to meet the application’s demands. Pods can communicate with each other across nodes in the cluster through the underlying VPC network facilitated by AWS.

## Configuration

:::note
Pods must be connected to a Cluster. To establish this connection, click and drag the top handle of the Pod element to the bottom handle of the parent Pod element.
:::

When you drag a Pod element onto the canvas in Deckhand, you'll be presented with options to configure the source from which the Pod should be deployed, including GitHub repositories or Docker Hub images.

### GitHub

1. **Repository Selection**: Search for and select from public repositories or your own private repositories via your connected GitHub account.
2. **Branch Selection**: After selecting a repository, a dropdown menu allows you to choose from available branches.
3. **Scaling**: Use the up and down arrows on the GitHub Pod element to adjust the number of Pod replicas. Adjusting the number of replicas in Deckhand controls how many instances of a container are running across different nodes in the cluster, enhancing your application's availability and load distribution.
4.  **Build**: Click the 'Build' button to have Deckhand automatically dockerize the repository contents and push the resulting image to Amazon Elastic Container Registry (ECR).
5. **Deploy**: After building, click the 'Deploy' button to have Deckhand configure and deploy all related Kubernetes resources (YAML configurations), including variables, ingresses, and volumes connected to the Pod.

:::warning
GitHub repositories must contain a properly configured Dockerfile in the root directory, as the application must be containerized to be deployed in a Kubernetes environment.
:::

### Docker Hub

1. **Image Selection**: Search and select from the vast array of public images available on Docker Hub.
2. **Version Selection**: Choose from available image tags (versions) using the dropdown menu on the Docker Pod element.
3. **Scaling**: Adjust the number of Pod replicas by using the up and down arrows. Adjusting the number of replicas in Deckhand controls how many instances of a container are running across different nodes in the cluster, enhancing your application's availability and load distribution.
4. **Deploy**: Once an image and its version are selected, proceed to deploy. Deckhand automates the configuration of all necessary YAMLs based on the Pod configuration, including connected variables, ingresses, and volumes.