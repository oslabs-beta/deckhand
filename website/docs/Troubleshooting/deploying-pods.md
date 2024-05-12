---
sidebar_position: 2
---

# Deploying Pods

An inability to deploy is typically an indication that there are not enough resources in your cluster to support the pods you are trying to run.

To troubleshoot, make sure you have enough resources in your cluster. At minimum, the instance type must be powerful enough to support at least one replica of the largest pod in your cluster, and there must be enough total nodes to support all pods collectively.

Adjust the following in your cluster configuration and try deploying again:

- Select instance type with higher capacity
- Increase the max number of nodes
