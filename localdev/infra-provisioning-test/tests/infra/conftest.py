import pytest
import boto3

import os

if "IN_CONTAINER" in os.environ:
    URL = "http://localstack:4566"
else:
    URL = "http://localhost:4566"
INFRA_REGION = "us-west-1"


@pytest.fixture(scope="session")
def s3_client():
    return boto3.client("s3", endpoint_url=URL, region=INFRA_REGION)


@pytest.fixture(scope="session")
def dynamodb_client():
    return boto3.client("dynamodb", endpoint_url=URL, region=INFRA_REGION)
