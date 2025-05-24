module "source_intake_s3_storage" { 
    source = "../../modules/s3"
    project     = var.project
    environment = var.environment
    name = "source-intake"
    enable_versioning = true
}

module "dynamodb_s3_metadata_lookup_table" {
  source = "../../modules/dynamodb"
  table_name = "s3-metadata-lookup-table"
  hash_key   = "item_id"     
  range_key = "creation_date"       

  attributes = [
    { name = "item_id", type = "S" },
    {name = "creation_date", type = "S"}
  ]

  global_secondary_indexes = []

  tags = {
    Project     = "Portfolio"
    ManagedBy   = "Terraform"
  }
}

module "dynamodb_config_table" {
  source = "../../modules/dynamodb"
  table_name = "config-table"
  hash_key   = "config_key"     
  attributes = [
    {name = "config_key", type = "S"}
  ]

  global_secondary_indexes = []

  tags = {
    Project     = "Portfolio"
    ManagedBy   = "Terraform"
  }
}


module "city_311_data" {
  source = "../../modules/dynamodb"
  table_name = "city_311_data"
  hash_key   = "SRNumber"     
  attributes = [
    { name = "SRNumber" , type = "S"},
    { name = "RequestType", type = "S"},
    { name = "UpdatedDate",type = "S" },
    { name = "Status" , type = "S"}, 
    { name = "CreatedDate" , type = "S"}, 
    {name = "RequestSource", type = "S"}
  ]

  global_secondary_indexes = [
    {
      name            = "UpdatedDateIndex",
      hash_key        = "RequestType",
      range_key       = "UpdatedDate",
      projection_type = "ALL",
      non_key_attributes = []
    },
    {
      name            = "StatusIndex",
      hash_key        = "Status",
      range_key       = "UpdatedDate",
      projection_type = "ALL",
      non_key_attributes = []
    },
    {
      name            = "CreatedDateIndex",
      hash_key        = "RequestSource",
      range_key       = "CreatedDate",
      projection_type = "ALL",
      non_key_attributes = []
    }
  ]

  tags = {
    Project     = "Portfolio"
    ManagedBy   = "Terraform"
  }
}




