
module "shared" {
  source      = "../../components/shared"
  project     = var.project
  environment = var.environment
}