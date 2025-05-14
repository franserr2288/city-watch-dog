locals {
  prefix               = "${var.project}-${var.environment}"
  function_name        = "${local.prefix}-city-311-source-intake"
  event_rule_name      = "${local.function_name}-schedule"
  event_target_id      = "${local.function_name}-target"
  lambda_role_name     = "${local.function_name}-role"
}

module "city_311_intake" {
  source = "../../modules/lambda"
  name   = "city-311-intake-${local.prefix}"

  inline_statements = [
    {
      sid       = "S3PutScoped"
      actions   = ["s3:PutObject"]
      resources = ["${var.bucket_arn}/*"]
    },
    {
      sid       = "DynamoReadScoped"
      actions   = ["dynamodb:GetItem","dynamodb:Query","dynamodb:Scan"]
      resources = ["${var.metadata_table_arn}"]
    },
    {
    sid       = "DynamoWriteScoped"
    actions   = [
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:BatchWriteItem"
    ]
    resources = [
      "${var.metadata_table_arn}",
    ]
  }
  ]

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
