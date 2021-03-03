  import {Construct, Duration} from "@aws-cdk/core";
  import {AwsCustomResource, AwsCustomResourcePolicy, AwsSdkCall, PhysicalResourceId} from "@aws-cdk/custom-resources";
  import {RetentionDays} from "@aws-cdk/aws-logs";
  import {Effect, PolicyStatement} from "@aws-cdk/aws-iam";

  export interface SingleInsertCustomResourceConstructProps {
    tableName: string
    tableArn: string
  }

  export class SingleInsertCustomResourceConstruct extends Construct {

    constructor(scope: Construct, id: string, props: SingleInsertCustomResourceConstructProps) {
      super(scope, id);
      this.insertRecord(props.tableName,props.tableArn,{
        id: {S:'ID_1'},
        userName: {S:'Tim'}
      })
    }

    private insertRecord( tableName: string,tableArn: string, item: any) {
      const awsSdkCall: AwsSdkCall = {
        service: 'DynamoDB',
        action: 'putItem',
        physicalResourceId: PhysicalResourceId.of(tableName + '_batch_inserts'),
        parameters: {
          TableName: tableName,
          Item: item
        }
      }
      const customResource: AwsCustomResource = new AwsCustomResource(this, tableName+"_custom_resource", {
            onCreate: awsSdkCall,
            onUpdate: awsSdkCall,
            logRetention: RetentionDays.ONE_WEEK,
            policy: AwsCustomResourcePolicy.fromStatements([
              new PolicyStatement({
                sid: 'DynamoWriteAccess',
                effect: Effect.ALLOW,
                actions: ['dynamodb:PutItem'],
                resources: [tableArn],
              })
            ]),
            timeout: Duration.minutes(5)
          }
      );
    }
  }
  