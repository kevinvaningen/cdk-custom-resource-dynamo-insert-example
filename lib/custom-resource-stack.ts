import {Construct, Stack, StackProps} from "@aws-cdk/core";
import {CdkCallCustomResourceConstruct} from "./cdk-call-custom-resource-construct";
import {AttributeType, Table} from "@aws-cdk/aws-dynamodb";
import {BatchInsertCustomResourceConstruct} from "./batch-insert-custom-resource-construct";

export class CustomResourceStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        const tableName = 'UserTable';
        super(scope, id, props);

        const dynamoTable = new Table(this, tableName, {
                tableName: tableName,
                partitionKey: {name: "id", type: AttributeType.STRING},
            }
        );

        const cdkCallCustomResourceConstruct = new CdkCallCustomResourceConstruct(this, 'cdkCallCustomResourceConstruct', {
            tableName: tableName,
            tableArn: dynamoTable.tableArn
        });
        cdkCallCustomResourceConstruct.node.addDependency(dynamoTable);

        const batchInsertCustomResourceConstruct = new BatchInsertCustomResourceConstruct(this, 'batchInsertCustomResourceConstruct', {
            tableName: tableName,
            tableArn: dynamoTable.tableArn
        });
        batchInsertCustomResourceConstruct.node.addDependency(dynamoTable);
    }
}
