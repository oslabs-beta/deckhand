---
sidebar_position: 1
---

# Project

In Deckhand, each project represents one Virtual Private Cloud (VPC), which is an isolated network dedicated to that project and provisioned in your linked AWS account. Each VPC can contain multiple clusters, providing a secure environment where resources such as Amazon EC2 instances can communicate with each other. 

Deckhand automatically sets up a VPC for each project, configuring the necessary subnets, gateways, and route tables to ensure a secure, isolated network for deploying Kubernetes clusters.

## Configuration

Click the New Project button on the Home page of the app to create a new project. Projects can be configured using the gear icon next to the project name at the top of the project page. 

:::note
By default, Deckhand uses **US East (Virginia)** as the region where your VPC will provisioned upon deployment. Adjust this as necessary if the majority of your userbase is concentrated elsewhere. Regions are available across North America, Europe, Asia Pacific, and South America.
:::

:::tip
Click the project name at the top of the project page to quickly rename the project in place.
:::