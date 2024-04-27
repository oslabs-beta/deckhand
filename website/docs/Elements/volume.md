---
sidebar_position: 6
---

# Volume

A Volume in Kubernetes is a storage unit attached to a Pod, allowing data to persist beyond the lifespan of any individual container. Volumes support several storage backends, including local storage, public cloud providers, and network storage systems like NFS or iSCSI. This makes it possible to manage application data persistently and consistently across multiple nodes and Pods in a Kubernetes cluster.

Deckhand will provision the necessary persistent volume claims, storage classes, and volumes upon deployment. Volumes in Deckhand are deployed using Amazon Elastic File System (EFS) when persistent storage is required by a pod. Deckhand automates the provisioning and mounting of EFS volumes to the EC2 instances, ensuring data persistence across pod reinitializations and node restarts. This integration allows for data to be consistently managed and accessed by applications running within the Kubernetes environment, with the added benefit of shared access across multiple nodes.

## Configuration

:::note
Volumes must be connected to a Pod. To establish this connection, click and drag the top handle of the Volume element to the bottom handle of the parent Pod element.
:::

When you drag a Volume element onto the canvas in Deckhand, it is crucial to specify the correct mount path to ensure seamless operation and data integrity. This is the directory within the container where the volume will be mounted, making the data stored on the volume accessible to the applications running inside the container.

### Determining the Mount Path

- **Refer to Application Documentation:** Start with the documentation provided by the application developers. This - documentation often details the directories that the application uses for various purposes.
- **Check Docker Hub:** If you are using a public Docker image, check the Docker Hub page or the GitHub repository associated with the image. These resources often include a README or other documentation that describes the filesystem layout and recommended mount points.
- **Experiment in a Safe Environment:** If documentation is lacking, consider running the container in a test environment with a shell to explore which directories it uses and modifies.