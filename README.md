<img alt="Kubernetes" src="https://img.shields.io/badge/Kubernetes-326CE5.svg?style=for-the-badge&logo=Kubernetes&logoColor=white"/><img alt="Terraform" src="https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white"/><img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=Docker&logoColor=white"/><img alt="Helm" src="https://img.shields.io/badge/Helm-0F1689.svg?style=for-the-badge&logo=Helm&logoColor=white"/><img alt="Amazon AWS" src="https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white"/><img alt="React" src="https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black"/><img alt="Redux" src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white"/><img alt="Node" src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
<img alt="Express" src="https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white"/><img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white"/><img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white"/><img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6.svg?style=for-the-badge&logo=CSS3&logoColor=white"/><img alt="Jest" src="https://img.shields.io/badge/Jest-C21325.svg?style=for-the-badge&logo=Jest&logoColor=white"/><img alt="Babel" src="https://img.shields.io/badge/Babel-F9DC3E.svg?style=for-the-badge&logo=Babel&logoColor=black"/>

# <img src="./website/static/img/deckhandlogowhite.png#gh-dark-mode-only" width="200" /><img src="./website/static/img/deckhandlogo.png#gh-light-mode-only" width="200" />

Ahoy! And welcome to the exciting world of Kubernetes. I'm your Deckhand.

I'll help you deploy a Kubernetes cluster with no code. Fully automated. Open source.

- **Simple to use:** Visual drag and drop interface lets you virtually craft your system design, so you can focus on what matters and automate the rest.

- **Connect any software:** Instantly search for and connect any commercial or open source software, including your private Github repositories, and deploy it with a click.

- **No vendor lock-in:** We'll deploy directly to your linked cloud provider, so you can involve Deckhand as much or as little as you'd like, and take back the wheel at any time.

## Features

<img align="right" src="./website/static/img/preview2.png" width="50%" />

Behind the scenes, Deckhand abstracts away all the work of deploying an application on Kubernetes, including:

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

## Getting Started

### Clusters

When you create a new project, you will be presented with an empty canvas. The ocean is yours, and fortunately the waves are miniscule. Drag a Cluster element on the screen and select the resources (instance type and number of nodes) you’d like to provide for your application. Want to scale vertically? Select a more powerful instance type. Want to scale horizontally? Increase the number of nodes.

### Pods

Next, drag over a Pod and connect it to your cluster. Here, you can choose between pulling in a Docker image or a GitHub repository. With your connected GitHub account, you can even pull in your private repositories. Deckhand automatically builds and stores your containerized application image. Do this for each of the microservices in your application. Do some parts of your application require particularly high availability and reliability? Simply adjust the number of replicas using the up and down arrows on the pod.

### Ingresses

Drag over an Ingress element and connect it to a pod to define the entry point to your application. Deckhand will automatically scan the connected pod to find the correct ports upon deployment.

### Variables

Have any environmental variables? Drag over a Variables element, connect it to the relevant pods, and Deckhand will scan the repository for the required variables. Simply enter those values where prompted, and Deckhand will encode and configure the ConfigMap and Secrets upon deployment.

### Volumes

Need persistent storage? Drag over a Volume element, connect it to a pod, and enter the mount path. Deckhand will provision the necessary persistent volume claims, storage classes, and volumes upon deployment.

### Deployment

And when you’re ready, hit deploy. Deckhand will update with the URL for your running, load-balanced application.

## Link Third-Party Accounts

### <img src="./website/static/img/github.svg" width="20" /> GitHub

GitHub is required to search, build, and deploy your Git repositories into Kubernetes pods. It is also how you log into Deckhand.

If you haven't already, first create GitHub account. Then, from the Deckhand login page, click "Log in with GitHub". This will redirect you to GitHub to authorize Deckhand to access your account and repositories. Click "Authoize Deckhand". This will redirect you back to the Deckhand app and log in.

### <img src="./website/static/img/aws.svg" width="20" /> Amazon Web Services (AWS)

We deploy directly to your AWS account. The specific services automated include AWS VPC, EKS, EC2, ECR and EFS.

If you haven't already, first create an AWS account. Then:

#### Create Deckhand IAM user

1. Login to AWS account as a root
2. Navigate to IAM -> Users -> Create User
3. Enter user name as "deckhand"
4. Check "Provide user access to the AWS Management Console"
5. Select "I want to create an IAM user"
6. Click "Next"
7. Select "Attach policies directly"
8. Search and check the "AdministratorAccess" policy
9. Click "Create User"
10. Save a record of your console sign-in URL, username, and password

#### Get credentials for Deckhand IAM user

1. Visit console sign-in URL, login as IAM user, and change password on login
2. Navigate IAM -> Users -> deckhand -> "Security credentials" tab
3. "Access keys" section -> Create access key
4. Select Command Line Interface (CLI)
5. Check "I understand the above recommendation…"
6. Click "Next"
7. Click "Create access key"
8. Save a record of your "Access key" and "Secret access key"
9. Enter these credentials in Deckhand when prompted to link your AWS account

## Troubleshooting

### Building Pods

If running locally, make sure the dependencies listed above are installed. Make sure Docker is running locally. Building repos and scanning ports uses the local Docker Daemon to execute docker commands.

Make sure Github repositories contain a Dockerfile. This is used to build the Docker image as well as scan the Dockerfile for the exposed port.

### Deploying Pods

An inability to deploy is typically an indication that there are not enough resources in your cluster to support the pods you are trying to run.

To troubleshoot, make sure you have enough resources in your cluster. Adjust the following in your cluster configuration and try deploying again:

- Increase the number of nodes
- Select instance type with higher capacity

## Future Development

Deckhand currently fully automates the deployment of Kubernetes clusters to Amazon Web Services (AWS), but let’s not drop the anchor there. We intentionally built the app using HCL and Terraform to maximize platform agnosticism. Future high-priority developments include:

- Google Cloud Platform support
- Microsoft Azure support
- Advanced cluster health and cost monitoring

As an open source product, we welcome your contributions! See the [Contributing](contributing.md) page for details.

## Star us on GitHub!

⭐ Anchor your support with a star! Your star not only supports our work but also boosts our visibility and community engagement. It's a simple gesture that propels our open source mission forward.
