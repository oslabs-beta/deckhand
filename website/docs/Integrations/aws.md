---
sidebar_position: 1
---

# Amazon Web Services (AWS)

<img align="right" src="/img/aws.svg" alt="AWS logo" width="175" />

We deploy directly to your AWS account. The specific services automated include AWS VPC, EKS, EC2, ECR and EFS. All keys are encrypted with AES-256.

If you haven't already, first create an AWS account. Then:

## Create Deckhand IAM user

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

## Get credentials for Deckhand IAM user

1. Visit console sign-in URL, login as IAM user, and change password on login
2. Navigate IAM -> Users -> deckhand -> "Security credentials" tab
3. "Access keys" section -> Create access key
4. Select Command Line Interface (CLI)
5. Check "I understand the above recommendation…"
6. Click "Next"
7. Click "Create access key"
8. Save a record of your "Access key" and "Secret access key"
9. Enter these credentials in Deckhand when prompted to link your AWS account
