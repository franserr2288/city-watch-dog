# EVENTS 
module "event_topics" {
  source = "../../modules/sns/topic"
  name   = "city_311_events"
}

module "dynamodb_event_store" {
  source = "../../modules/dynamodb"
  table_name = "event-store"
  hash_key   = "event_key"     
  attributes = [
    {name = "event_key", type = "S"},
    {name = "created_date" , type = "S"}, 
  ]

  global_secondary_indexes = [
    {
      name = "created_date_index"
      hash_key = "created_date"
      range_key = "event_key"
      projection_type = "ALL"
      non_key_attributes = []
    }
  ]

  tags = {
    Project     = "Portfolio"
    ManagedBy   = "Terraform"
  }
}

# INGESTION DATA STORES

## SNAPSHOT
module "source_intake_s3_storage" { 
  source = "../../modules/s3"
  project     = var.project
  environment = var.environment
  name = "source-intake"
  enable_versioning = true
}

## INGESTION WORKFLOW CONFIG TABLE 
module "dynamodb_config_table" {
  source = "../../modules/dynamodb"
  table_name = "config-store"
  hash_key   = "config_key"     
  attributes = [
    {name = "config_key", type = "S"},
  ]

  global_secondary_indexes = []

  tags = {
    Project     = "Portfolio"
    ManagedBy   = "Terraform"
  }
}

## INTAKE TABLE 
module "city_311_data" {
  source = "../../modules/dynamodb"
  table_name = "city-311-data-store"
  hash_key   = "sr_number" 

  attributes = [
    { name = "sr_number" , type = "S"},
    { name = "request_type", type = "S"},
    { name = "updated_date",type = "S" },
    { name = "status" , type = "S"}, 
    { name = "created_date" , type = "S"}, 
    {name = "request_source", type = "S"}
  ]

  global_secondary_indexes = [
    {
      name = "request_type_index"
      hash_key = "request_type",
      range_key = "created_date",
      projection_type = "ALL"        
      non_key_attributes = [] 
    }, 
    {
      name = "status_index"
      hash_key = "status",
      range_key = "created_date",
      projection_type = "ALL"        
      non_key_attributes = [] 
    },
    {
      name = "updated_date_index"
      hash_key = "updated_date",
      range_key = "sr_number",
      projection_type = "KEYS_ONLY"        
      non_key_attributes = [] 
    },
    {
      name = "request_source_index"
      hash_key = "request_source",
      range_key = "sr_number",
      projection_type = "KEYS_ONLY"        
      non_key_attributes = [] 
    },
    {
      name = "created_date_index"
      hash_key = "created_date"
      range_key = "sr_number"
      projection_type = "KEYS_ONLY"
      non_key_attributes = []
    }
  ]

  tags = {
    Project     = "Portfolio"
    ManagedBy   = "Terraform"
  }
}



