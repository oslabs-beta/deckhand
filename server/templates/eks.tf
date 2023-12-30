
variable "clusterName" {
  type = string
}

variable "nodeGroupName" { // this can be made by us, as clustername plus a number
  type = string
}

variable "min" {
  type = number
}

variable "max" {
  type = number
}

variable "desired" {
  type = number
}

variable "instanceType" {
  type = string
}

variable "vpcId" {
  type = string
}

variable "private_subnets" {
  type = list
}

variable "vpc_cidr_block" {
  type = string
}

module "eks" {
  # next two lines are a copy and paste from terraform docs. This tells terraform what the module is
  # source  = "terraform-aws-modules/eks/aws"
  # version = "19.20.0"
  source = "../../../.terraform/modules/eks"

  cluster_name   = var.clusterName
  cluster_version = "1.28"

  cluster_endpoint_private_access = true
  cluster_endpoint_public_access  = true

  vpc_id                   = var.vpcId 
  subnet_ids               = var.private_subnets
  # subnet_ids               = module.vpc.private_subnets  // need to find these ids 
  # control_plane_subnet_ids = ["10.123.5.0/24", "10.123.6.0/24"] // these are the intra subnets

  enable_irsa = true

  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    # efs-csi = {
    #   most_recent = true
    # }
  }




  # ##### EVERYTHING HERE ADDED TO TEST IF ADDS CSI DRIVER #####
  # # Enable the EFS CSI Driver add-on
  # manage_aws_auth = true
  # map_roles = [
  #   {
  #     rolearn  = "${module.eks_cluster.worker_iam_role_arn}"
  #     username = "system:node:{{EC2PrivateDNSName}}"
  #     groups   = ["system:bootstrappers", "system:nodes"]
  #   }
  # ]
  
  # additional_tags = {
  #   Terraform = "true"
  #   Environment = "production"
  # }

  # # Enable EFS CSI Driver add-on
  # efs_csi_provider = {
  #   enabled = true
  # }
  # ################## END #################  

  eks_managed_node_group_defaults = {
    ami_type = "AL2_x86_64"
    vpc_security_group_ids = [aws_security_group.efs.id]
  }

  eks_managed_node_groups = {
    deckhand-worker-group = {
      name = var.nodeGroupName
      min_size     = var.min
      max_size     = var.max
      desired_size = var.desired

      instance_types = [var.instanceType]
      // capacity_type  = "SPOT" // options are spot or on-demand ... I don't yet understand the difference
     
      
    }
  }

}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
      command     = "aws"
    }
  }
}

########################
#  EKS DRIVER FOR EFS  #
########################

resource "helm_release" "aws_efs_csi_driver" {
  chart      = "aws-efs-csi-driver"
  name       = "aws-efs-csi-driver"
  namespace  = "kube-system"
  repository = "https://kubernetes-sigs.github.io/aws-efs-csi-driver/"

  set {
    name  = "image.repository"
    value = "602401143452.dkr.ecr.eu-west-3.amazonaws.com/eks/aws-efs-csi-driver"
  }

  set {
    name  = "controller.serviceAccount.create"
    value = true
  }

  set {
    name  = "controller.serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = module.attach_efs_csi_role.iam_role_arn
  }

  set {
    name  = "controller.serviceAccount.name"
    value = "efs-csi-controller-sa"
  }
}

module "attach_efs_csi_role" {
  source = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"

  role_name             = "efs-csi"
  attach_efs_csi_policy = true

  oidc_providers = {
    ex = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:efs-csi-controller-sa"]
    }
  }
}

##########################
#############################

# module "efs_csi_driver" {
#   source = "git::https://github.com/DNXLabs/terraform-aws-eks-efs-csi-driver.git"

#   # cluster_name                     = module.eks_cluster.cluster_id
#   # cluster_identity_oidc_issuer     = module.eks_cluster.cluster_oidc_issuer_url
#   # cluster_identity_oidc_issuer_arn = module.eks_cluster.oidc_provider_arn

#   cluster_name                     = module.eks.cluster_id
#   cluster_identity_oidc_issuer     = module.eks.cluster_oidc_issuer_url
#   cluster_identity_oidc_issuer_arn = module.eks.oidc_provider_arn
# }

// Provisioning one EFS per cluster. Can be called upon by mutiple Persistent Volume Claims
resource "aws_security_group" "efs" {
  name        = "${var.clusterName}-efs"
  description = "Allow traffic"
  vpc_id      = var.vpcId 

  ingress {
    description      = "nfs"
    from_port        = 2049
    to_port          = 2049
    protocol         = "TCP"
    cidr_blocks      = [var.vpc_cidr_block] 
  }
}

resource "aws_iam_policy" "node_efs_policy" {
  name        = "eks_node_efs-${var.clusterName}"
  path        = "/"
  description = "Policy for EKS nodes to use EFS"

  policy = jsonencode({
    "Statement": [
        {
            "Action": [
                "elasticfilesystem:DescribeMountTargets",
                "elasticfilesystem:DescribeFileSystems",
                "elasticfilesystem:DescribeAccessPoints",
                "elasticfilesystem:CreateAccessPoint",
                "elasticfilesystem:DeleteAccessPoint",
                "ec2:DescribeAvailabilityZones"
            ],
            "Effect": "Allow",
            "Resource": "*",
            "Sid": ""
        }
    ],
    "Version": "2012-10-17"
}
  )
}

resource "aws_efs_file_system" "kube" {
  creation_token = "eks-efs"
}

resource "aws_efs_mount_target" "mount" {
    file_system_id = aws_efs_file_system.kube.id
    subnet_id = each.key
    for_each = toset(var.private_subnets)
    security_groups = [aws_security_group.efs.id]
}

output "efs-id" {
  description = "ID generated by AWS associated with this Elastic File System"
  value       = aws_efs_file_system.kube.id
}

