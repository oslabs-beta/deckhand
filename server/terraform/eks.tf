# variable "clusterName" {
#   type = string
# }

# variable "nodeGroupName" { // this can be made by us, as clustername plus a number
#   type = string
# }

# variable "min" {
#   type = number
# }

# variable "max" {
#   type = number
# }

# variable "instanceType" {
#   type = string
# }


# module "eks" {
#   // next two lines are a copy and paste from terraform docs. This tells terraform what the module is
#   source  = "terraform-aws-modules/eks/aws"
#   version = "19.20.0"

#   cluster_name   = var.clusterName
#   cluster_version = "1.27"

#   vpc_id                   = module.vpc.vpc_id //WILL THIS KEY INTO MODULE FROM ANOTHER FILE??
#   subnet_ids               =  module.vpc.private_subnets 
#   # control_plane_subnet_ids = ["10.123.5.0/24", "10.123.6.0/24"] // these are the intra subnets
#   cluster_endpoint_public_access = true

#   # cluster_addons = {
#   #   coredns = {
#   #     most_recent = true
#   #   }
#   #   kube-proxy = {
#   #     most_recent = true
#   #   }
#   #   vpc-cni = {
#   #     most_recent = true
#   #   }
#   # }


#   eks_managed_node_groups = {
#     deckhand-worker-group = {
#       name = var.nodeGroupName
#       min_size     = var.min
#       max_size     = var.max
#       desired_size = 1

#       instance_types = [var.instanceType]
#       # capacity_type  = "SPOT" // options are spot or on-demand ... I don't yet understand the difference
     

#       # tags = {
#       #   ExtraTag = "yay-nodes"
#       # }
#     }
#   }

# }