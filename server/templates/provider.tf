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
  access_key = var.accessKey
  secret_key = var.secretKey
}