import boto3


def test_dynamodb_tables_exists():
    s3 = boto3.client("dynamodb", endpoint_url="http://localstack:4566")

    tables = s3.list_tables()
    print(tables)
    table_names = [str(name) for name in tables["TableNames"]]
    # TODO: AFTER MAKING INFRA CHANGE TO 311 TABLE NAME CHANGE IT HERE
    required_tables = ["config-table", "city_311_data", "s3-metadata-lookup-table"]
    assert all((required in table_names) for required in required_tables)
