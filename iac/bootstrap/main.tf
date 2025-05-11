provider "aws" {
  region = "us-west-1" 
}

module "s3-remote-state" {
    source = "../modules/s3"
    project     = var.project
    environment = var.environment
    name = "terraform-remote-state"
    enable_versioning = true
}

module "dynamodb-state-lock-table" {
  source = "./dynamodb_module"

  table_name = "my-awesome-app-data" 
  hash_key   = "item_id"            

  attributes = [
    { name = "item_id", type = "S" },
  ]

  global_secondary_indexes = [
    {
      name            = "user_id-index"
      hash_key        = "user_id"
      projection_type = "KEYS_ONLY" # ALL, KEYS_ONLY, or INCLUDE
    }
  ]

  tags = {
    Project     = "Portfolio"
    ManagedBy   = "Terraform"
  }
}


