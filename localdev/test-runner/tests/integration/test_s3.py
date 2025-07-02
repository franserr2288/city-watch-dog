import boto3


def test_s3_bucket_exists():
    s3 = boto3.client("s3", endpoint_url="http://localstack:4566")

    buckets = s3.list_buckets()
    bucket_names = [str(b["Name"]) for b in buckets["Buckets"]]

    assert any(
        bucket_name.startswith("los-angeles-data-dev-source-intake")
        for bucket_name in bucket_names
    )
