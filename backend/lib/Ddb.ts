import { AttributeType, BillingMode, ProjectionType, Table } from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import { RemovalPolicy } from '@aws-cdk/core';

export class Ddb {
    constructor(substack: cdk.Construct, appName: string) {
        const userTable = new Table(substack, 'prod-user-table', {
            billingMode: BillingMode.PROVISIONED,
            readCapacity: 20,
            writeCapacity: 20,
            removalPolicy: RemovalPolicy.RETAIN,
            partitionKey: {name: 'id', type: AttributeType.STRING},
            tableName: 'prod-userInfo'
        });

        userTable.addGlobalSecondaryIndex({
            indexName: 'emailIndex',
            partitionKey: {name: 'email', type: AttributeType.STRING},
            projectionType: ProjectionType.ALL
        });

        // TODO: add other GSIs after looking through firebase before migration
    }
}