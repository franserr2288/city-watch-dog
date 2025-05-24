locals {
  prefix               = "${var.project}-${var.environment}"
  snapshot_function_key = "city-311-snapshot"
  function_build_base_path = "${path.root}/../../../build/lambdas"
  snapshot_function_name        = "${local.prefix}-${local.snapshot_function_key}"
  event_rule_name      = "${local.snapshot_function_name}-schedule"
  event_target_id      = "${local.snapshot_function_name}-target"
  lambda_role_name     = "${local.snapshot_function_name}-role"
}

module "city_311_intake" {
  source = "../../modules/lambda"
  name   = local.snapshot_function_name
  filename         = "${local.function_build_base_path}/${local.snapshot_function_key}-package.zip"
  handler = "handler.default"
  role_arn = module.intake_iam_role.role_arn
}

module "intake_iam_role" { 
  source = "../../modules/iam/lambda-role"
  dynamodb_table_access = [var.metadata_table_arn]
  s3_bucket_access = [var.intake_bucket_arn]
  s3_read_only = false
  dynamodb_read_only = false
  role_name = local.lambda_role_name
}


resource "aws_cloudwatch_event_rule" "schedule" {
  name                = local.event_rule_name
  schedule_expression = "rate(1 day)"
}

resource "aws_cloudwatch_event_target" "target" {
  rule      = aws_cloudwatch_event_rule.schedule.name
  target_id = local.event_target_id
  arn       = module.city_311_intake.function_arn
}

resource "aws_lambda_permission" "event_permission" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = module.city_311_intake.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.schedule.arn
}
