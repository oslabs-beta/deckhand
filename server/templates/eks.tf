## This version is adding EFS Provisioning 

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
    ## Previously coredns showed up as degraded. Putting it back, hopefully can solve
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
  }

  eks_managed_node_group_defaults = {
    ami_type = "AL2_x86_64"
    vpc_security_group_ids = [aws_security_group.efs.id]
    // Note: the docs has above as .eks. and I changed it to .efs. Was it a typo in the docs?
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
    // TODO: make sure this is getting the variable properly 
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
    // TODO: make sure these variable are connected properly
    for_each = toset(var.private_subnets)
    security_groups = [aws_security_group.efs.id]
    
}

// TODO: Pick up at "Adding the EFS Controller" at this link https://andrewtarry.com/posts/aws-kubernetes-with-efs/

// kubectl kustomize "github.com/kubernetes-sigs/aws-efs-csi-driver/deploy/kubernetes/overlays/stable/?ref=release-1.7" > public-ecr-driver.yaml

# I got this response. I didn't run the command yet: "Warning: 'bases' is deprecated. Please use 'resources' instead. Run 'kustomize edit fix' to update your Kustomization automatically."

