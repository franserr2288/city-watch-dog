module "store_events_subscription" {
  source = "../../modules/sns/lambda-subscription"
  topic_arn = var.city_events_topic_arn
  lambda_function_arn = module.store_events_lambda.function_arn
}

# module "store_events_lambda" {
    # source = "../../modules/lambda"
    #   name   = "store_events_lambda"
    #   filename         = 
    #   handler = "handler.default"
    #   role_arn = module.intake_iam_role.role_arn

# }

# module "store_events_iam_role" { 
#   source = "../../modules/iam/lambda-role"
#   dynamodb_table_access = [var.event_store_arn]
#   s3_bucket_access = []
#   s3_read_only = false
#   dynamodb_read_only = false
#   role_name = "store_events_lambda_role"
# }
