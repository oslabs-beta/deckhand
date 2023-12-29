# Filter out local zones, which are not supported with managed node groups
data "aws_availability_zones" "available" {
  filter {
    name   = "opt-in-status"
    values = ["opt-in-not-required"]
  }
}

variable "vpc_name" {
  type = string
}

module "vpc" {
  // source  = "terraform-aws-modules/vpc/aws" --> This is needed to initialize at first
  # version = "5.0.0" // only use version on initial download 
  source  = "../../../.terraform/modules/vpc" // This allows us to reference the module files elsewhere so don't need to downlaod for every single user

  name = var.vpc_name
  cidr = "10.0.0.0/16"

  azs  = slice(data.aws_availability_zones.available.names, 0, 3)
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"] // can reach gateway only through a public_subnet
  public_subnets  = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"] // directly connected to gateway

  enable_nat_gateway = true
  single_nat_gateway   = true
  enable_dns_hostnames = true
}

output "vpc_id" {
  description = "ID generated by AWS associated with this VPC"
  value       = module.vpc.vpc_id
}

output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = module.vpc.private_subnets
}

output "vpc_cidr_block" {
  description = "VPC cidr block"
  value       = module.vpc.vpc_cidr_block
}