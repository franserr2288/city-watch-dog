terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region                      = var.region
  access_key                 = "test"
  secret_key                 = "test"
  s3_use_path_style          = true 
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  # endpoints {
  #   s3       = "http://localhost:4566"
    
  #   lambda   = "http://localhost:4566"
  #   ec2      = "http://localhost:4566"
  #   ecs      = "http://localhost:4566"
    
  #   dynamodb = "http://localhost:4566"
  #   rds      = "http://localhost:4566"
    
  #   iam      = "http://localhost:4566"
  #   sts      = "http://localhost:4566"
    
  #   sns      = "http://localhost:4566"
  #   sqs      = "http://localhost:4566"
    
  #   cloudwatch      = "http://localhost:4566"
  #   cloudwatchlogs  = "http://localhost:4566"
    
  #   apigateway = "http://localhost:4566"
    
  #   cloudformation = "http://localhost:4566"
  #   ssm           = "http://localhost:4566"
  # }
}
