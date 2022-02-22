import {AttributeType, BillingMode, Table} from "@aws-cdk/aws-dynamodb";
import * as cdk from "@aws-cdk/core";
import {RemovalPolicy} from "@aws-cdk/core";

export class CounterTable {
    constructor(substack: cdk.Construct, appName: string) {
        // Counter table
        const counterTable = new Table(substack, 'prod-counter', {
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN,
            partitionKey: {name: 'name', type: AttributeType.STRING},
            tableName: 'prod-counter'
        });
    }
}