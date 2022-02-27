import {AttributeType, BillingMode, Table} from "@aws-cdk/aws-dynamodb";
import * as cdk from "@aws-cdk/core";
import {RemovalPolicy} from "@aws-cdk/core";

export class EmailVerificationTable {
    constructor(substack: cdk.Construct, appName: string) {
        // Email verification table
        const emailVerificationTable = new Table(substack, 'prod-emailVerification', {
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN,
            partitionKey: {name: 'emailAddress', type: AttributeType.STRING},
            tableName: 'prod-emailVerification'
        });
    }
}