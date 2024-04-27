---
sidebar_position: 2
---

# Getting Started

## Cluster

When you create a new project, you will be presented with an empty canvas. The ocean is yours, and the winds are favorable. Drag a Cluster element on the screen and select the resources (instance type and number of nodes) you’d like to provide for your application. Want to scale vertically? Select a more powerful instance type. Want to scale horizontally? Increase the number of nodes.

:::tip
For computationally intensive applications, ensure the instance type is powerful enough to support at least one replica of the largest pod in your cluster.
:::

## Pod

Next, drag over a Pod and connect it to your cluster. Here, you can choose between pulling in a Docker image or a GitHub repository. With your connected GitHub account, you can even pull in your private repositories. Deckhand automatically builds and stores your containerized application image. Do this for each of the microservices in your application. Do some parts of your application require particularly high availability and reliability? Simply adjust the number of replicas using the up and down arrows on the pod.

## Ingress

Drag over an Ingress element and connect it to a pod to define the entry point to your application. Deckhand will automatically scan the connected pod to find the correct ports upon deployment.

## Variables

Have any environmental variables? Drag over a Variables element, connect it to the relevant pods, and Deckhand will scan the repository for the required variables. Simply enter those values where prompted, and Deckhand will encode and configure the ConfigMap and Secrets upon deployment.

## Volume

Need persistent storage? Drag over a Volume element, connect it to a pod, and enter the mount path. Deckhand will provision the necessary persistent volume claims, storage classes, and volumes upon deployment.

## Deployment

And when you’re ready, hit deploy. Deckhand will update with the URL for your running, load-balanced application.
