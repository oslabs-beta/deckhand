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
