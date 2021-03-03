import {Construct, Stack, StackProps} from "@aws-cdk/core";
import {AttributeType, Table} from "@aws-cdk/aws-dynamodb";
import {BatchInsertCustomResourceConstruct} from "./batch-insert-custom-resource-construct";
import {SingleInsertCustomResourceConstruct} from "./single-insert-custom-resource-construct";

export class CustomResourceStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        const tableName = 'UserTable';
        super(scope, id, props);

        const dynamoTable = new Table(this, tableName, {
                tableName: tableName,
                partitionKey: {name: "id", type: AttributeType.STRING},
            }
        );

        const cdkCallCustomResourceConstruct = new SingleInsertCustomResourceConstruct(this, 'cdkCallCustomResourceConstruct', {
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
