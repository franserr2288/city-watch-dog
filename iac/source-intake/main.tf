variable "project" {
  type        = string
  description = "Project or system name (e.g. los-angeles)"
}

variable "environment" {
  type        = string
  description = "Environment name (e.g. dev, prod)"
}

variable "bucket_name" {
  type        = string
  description = "Shared S3 bucket name to write to"
}

variable "bucket_arn" {
  type        = string
  description = "ARN of the shared bucket"
}

locals {
  prefix               = "${var.project}-${var.environment}"
  function_name        = "${local.prefix}-city-311-source-intake"
  event_rule_name      = "${local.function_name}-schedule"
  event_target_id      = "${local.function_name}-target"
  lambda_role_name     = "${local.function_name}-role"
}

##################################
# IAM Role Scoped To Source-Intake Function
##################################

resource "aws_iam_role" "lambda_exec" {
  name = local.lambda_role_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "${local.function_name}-policy"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect   = "Allow",
        Action   = [ "s3:PutObject" ],
        Resource = "${var.bucket_arn}/*"
      }
    ]
  })
}

##################################
# Lambda Function
##################################

resource "aws_lambda_function" "city_311_source_intake" {
  function_name = local.function_name

  handler = "handler.handler"
  runtime = "nodejs20.x"
  role    = aws_iam_role.lambda_exec.arn

  filename         = "${path.module}/lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda.zip")

  timeout = 30

  environment {
    variables = {
      NODE_ENV    = "production"
      BUCKET_NAME = var.bucket_name
    }
  }
}

##################################
# Scheduled Trigger
##################################

resource "aws_cloudwatch_event_rule" "schedule" {
  name                = local.event_rule_name
  schedule_expression = "rate(1 day)"
}

resource "aws_cloudwatch_event_target" "target" {
  rule      = aws_cloudwatch_event_rule.schedule.name
  target_id = local.event_target_id
  arn       = aws_lambda_function.city_311_source_intake.arn
}

resource "aws_lambda_permission" "event_permission" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.city_311_source_intake.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.schedule.arn
}
