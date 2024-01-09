---
sidebar_position: 1
---

# Introduction

<img align="right" src="/img/ship-character.png" width="175" />

Ahoy! And welcome to the exciting world of Kubernetes. I'm your Deckhand.

I'll help you deploy a Kubernetes cluster with no code. Fully automated. Open source.

**Simple to use:** Visual drag and drop interface lets you virtually craft your system design, so you can focus on what matters and automate the rest.

**Connect any software:** Instantly search for and connect any commercial or open source software, including your private Github repositories, and deploy it with a click.

**No vendor lock-in:** We'll deploy directly to your linked cloud provider, so you can involve Deckhand as much or as little as you'd like, and take back the wheel at any time.

## Features

<img align="right" src="/img/deckhandlogoicon.png" width="175" />

Behind the scenes, Deckhad abstracts away all the work of setting up a Kubernetes cluster, including:

- Setting up VPCs, subnets, route tables, security groups, and gateways
- Provisioning an EKS cluster and installing all the necessary add-ons
- Spinning up EC2 instances as nodes in the cluster
- Implementing an EFS for volume storage
- Dockerizing Github repos and pushing to ECR
- Pulling down Docker Hub images
- Scanning images for necessary environmental variables and exposed ports, guiding the user to add them to their configurations
- Generating YAML files for deployments, services, configmaps, secrets, persistent volume claims, and ingresses
- Applying all the YAML files to your cluster
- Obtaining a public url for your app
- Automating the entire teardown process with a single click
