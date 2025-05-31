module "s3-remote-state" {
    source = "../modules/s3"
    project     = var.project
    environment = var.environment
    name = "terraform-remote-state"
    enable_versioning = true
}

module "dynamodb-state-lock-table" {
  source = "../modules/dynamodb"
  table_name = "terraform-remote-state-lock"
  hash_key  = "LockID"  
  range_key = null        

  attributes = [
    { name = "LockID", type = "S" }
  ]

  global_secondary_indexes = []

  tags = {
    Project     = "Portfolio"
    ManagedBy   = "Terraform"
  }
}


