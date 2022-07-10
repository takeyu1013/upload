data "google_client_config" "current" {}
module "gcs_buckets" {
  source     = "terraform-google-modules/cloud-storage/google"
  project_id = data.google_client_config.current.project
  prefix     = data.google_client_config.current.project
  names      = ["bucket"]
  location   = "asia-northeast1"
}
