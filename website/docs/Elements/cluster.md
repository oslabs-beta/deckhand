---
sidebar_position: 2
---

# Cluster

A Kubernetes cluster is a set of node machines for running containerized applications. A cluster consists of at least one worker node and a master node that coordinates all activities within your cluster, such as scheduling applications, maintaining applications' desired state, scaling applications, and rolling out new updates.

A worker node hosts the Pods that are the components of the application workload. The master node manages the worker nodes and the Pods in the cluster. In essence, a Kubernetes cluster brings together individual physical or virtual machines into a unified resource pool, providing a platform for deploying and managing containerized applications at scale.

This architecture not only ensures high availability but also allows for scaling resources or applications on demand without disrupting existing services, making it an ideal choice for deploying applications that need to scale and adapt to changes quickly.

Clusters within a Deckhand project are deployed using Amazon Elastic Kubernetes Service (EKS) combined with EC2 instances. Amazon EKS manages the Kubernetes control plane, ensuring high availability, scalability, and security. Deckhand provisions EC2 instances as worker nodes that join the EKS cluster, configuring them with the necessary networking and security settings to integrate smoothly within the VPC.

## Configuration

When you drag a Cluster element onto the canvas in Deckhand, you can configure several options to tailor the cluster to your specific needs:

- **Instance Type:** Specifies the type of EC2 instances used for the worker nodes in your cluster. Choosing the right instance type is crucial for balancing cost and performance based on your application requirements. Various instance types are available, ranging from general-purpose instances like `t2.medium` to compute-optimized instances like `c5.large`.
- **Minimum Nodes:** Sets the minimum number of worker nodes that the cluster should maintain. This setting ensures that your cluster has enough capacity to handle the workload even during low-demand periods or when some nodes are under maintenance. All clusters must have at least 1 node.
- **Maximum Nodes:** Determines the upper limit of worker nodes that the cluster can scale up to. This is used in conjunction with Kubernetes autoscaling to dynamically adjust the number of nodes based on the workload requirements. Must be equal to or greater than the minimum nodes setting.
- **Desired Nodes:** Specifies the desired number of worker nodes in the cluster. This number is adjusted by the autoscaler to meet the actual workload demand, staying within the minimum and maximum nodes constraints. Must be between the minimum nodes and maximum nodes.

:::tip
For computationally intensive applications, ensure the instance type is powerful enough to support at least one replica of the largest pod in your cluster, and that there are enough nodes to support all pods collectively.
:::