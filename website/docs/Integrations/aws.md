---
sidebar_position: 1
---

# Amazon Web Services (AWS)

Deckhand seamlessly deploys directly into your AWS account, leveraging a range of AWS services to ensure a robust and secure environment. Our automated deployment includes the configuration of AWS VPC, EKS, EC2, ECR, and EFS, with all keys securely encrypted using AES-256 encryption to safeguard your data.

## Getting Started

<img align="right" src="/img/aws.svg" alt="AWS logo" width="175" />

If you haven't done so already, your first step is to [create an AWS account](https://portal.aws.amazon.com/billing/signup). Next, follow these steps to create an IAM user that Deckhand will use to deploy your app:

### Create Deckhand IAM user

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

### Get credentials for Deckhand IAM user

1. Visit console sign-in URL, login as IAM user, and change password on login
2. Navigate IAM -> Users -> deckhand -> "Security credentials" tab
3. "Access keys" section -> Create access key
4. Select Command Line Interface (CLI)
5. Check "I understand the above recommendation…"
6. Click "Next"
7. Click "Create access key"
8. Save a record of your "Access key" and "Secret access key"
9. Enter these credentials in Deckhand when prompted to link your AWS account
