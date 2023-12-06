variable "region" {
  type = string
}

variable "accessKey" {
  type = string
}

variable "secretKey" {
  type = string
}

provider "aws" {
  region = var.region
  access_key = var.accessKey # access in AWS profile under "my securty credentials" Then create new access key 
  secret_key = var.secretKey
}

output "region" {
  value = var.region
}