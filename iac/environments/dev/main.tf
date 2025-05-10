module "shared" {
  source      = "../../components/shared"
  project     = local.project
  environment = local.environment
}

module "source_intake" {
  source       = "../../components/source-intake"
  project      = local.project
  environment  = local.environment
  bucket_name  = module.shared.intake_bucket_name
  bucket_arn   = module.shared.intake_bucket_arn
}
