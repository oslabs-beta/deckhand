
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


module "eks" {
  // next two lines are a copy and paste from terraform docs. This tells terraform what the module is
  # source  = "terraform-aws-modules/eks/aws"
  # version = "19.20.0"
  source = "../../../../.terraform/modules/eks"

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
    ## Try without since degraded
    # coredns = {
    #   most_recent = true
    # }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
  }

  eks_managed_node_group_defaults = {
    ami_type = "AL2_x86_64"
  }

  eks_managed_node_groups = {
    deckhand-worker-group = {
      name = var.nodeGroupName
      min_size     = var.min
      max_size     = var.max
      desired_size = var.desired

      instance_types = [var.instanceType]
      //capacity_type  = "SPOT" // options are spot or on-demand ... I don't yet understand the difference
     
      
    }
  }

}

# # TRY WITHOUT BELOW SINCE DEGRADED
##################
# data "aws_iam_policy" "ebs_csi_policy" {
#   arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
# }


# // TODO: This module isn't working. I don't know if the source is wrong or if the way the variables are being referrenced are wrong with the file structure. 
# // Error: "argument named "role_name" is not expected here. "
# // "argument named "provider_url" is not expected here."
# // "argument named "provider_url" is not expected here."
# // "argument named "oidc_fully_qualified_subjects" is not expected here."
# module "irsa-ebs-csi" {
#   source  = "terraform-aws-modules/iam/aws//modules/iam-assumable-role-with-oidc"
#   version = "4.7.0"
#   # source = "../../../../.terraform/modules/irsa-ebs-csi"
#   # source = "../../../../.terraform/modules/iam-assumable-role-with-oidc"

#   create_role                   = true
#   role_name                     = "AmazonEKSTFEBSCSIRole-${module.eks.cluster_name}"
#   provider_url                  = module.eks.oidc_provider
#   role_policy_arns              = [data.aws_iam_policy.ebs_csi_policy.arn]
#   oidc_fully_qualified_subjects = ["system:serviceaccount:kube-system:ebs-csi-controller-sa"]
# }

# resource "aws_eks_addon" "ebs-csi" {
#   cluster_name             = module.eks.cluster_name
#   addon_name               = "aws-ebs-csi-driver"
#   addon_version            = "v1.20.0-eksbuild.1"
#   service_account_role_arn = module.irsa-ebs-csi.iam_role_arn
#   tags = {
#     "eks_addon" = "ebs-csi"
#     "terraform" = "true"
#   }
# }
################

####### HAS BEEN COMMENTED OUT FOR A WHILE ##########
# module "allow_eks_access_iam_policy" {
#   source  = "terraform-aws-modules/iam/aws//modules/iam-policy"
#   version = "5.3.1"

#   name          = "allow-eks-access"
#   create_policy = true

#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = [
#           "eks:DescribeCluster",
#         ]
#         Effect   = "Allow"
#         Resource = "*"
#       },
#     ]
#   })
# }

# module "eks_admins_iam_role" {
#   source  = "terraform-aws-modules/iam/aws//modules/iam-assumable-role"
#   version = "5.3.1"

#   role_name         = "eks-admin"
#   create_role       = true
#   role_requires_mfa = false

#   custom_role_policy_arns = [module.allow_eks_access_iam_policy.arn]

#   trusted_role_arns = [
#     "arn:aws:iam::${module.vpc.vpc_owner_id}:root"
#   ]
# }

# module "user1_iam_user" {
#   source  = "terraform-aws-modules/iam/aws//modules/iam-user"
#   version = "5.3.1"

#   name                          = "user1"
#   create_iam_access_key         = false
#   create_iam_user_login_profile = false

#   force_destroy = true
# }

# module "allow_assume_eks_admins_iam_policy" {
#   source  = "terraform-aws-modules/iam/aws//modules/iam-policy"
#   version = "5.3.1"

#   name          = "allow-assume-eks-admin-iam-role"
#   create_policy = true

#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = [
#           "sts:AssumeRole",
#         ]
#         Effect   = "Allow"
#         Resource = module.eks_admins_iam_role.iam_role_arn
#       },
#     ]
#   })
# }

# module "eks_admins_iam_group" {
#   source  = "terraform-aws-modules/iam/aws//modules/iam-group-with-policies"
#   version = "5.3.1"

#   name                              = "eks-admin"
#   attach_iam_self_management_policy = false
#   create_group                      = true
#   group_users                       = [module.user1_iam_user.iam_user_name]
#   custom_group_policy_arns          = [module.allow_assume_eks_admins_iam_policy.arn]
# }