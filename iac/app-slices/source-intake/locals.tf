locals {
  prefix               = "${var.project}-${var.environment}"
  function_name        = "${local.prefix}-city-311-source-intake"
  event_rule_name      = "${local.function_name}-schedule"
  event_target_id      = "${local.function_name}-target"
  lambda_role_name     = "${local.function_name}-role"
}