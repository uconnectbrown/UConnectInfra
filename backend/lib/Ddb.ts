import {AttributeType, BillingMode, ProjectionType, Table} from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import {RemovalPolicy} from '@aws-cdk/core';

export class Ddb {
    constructor(substack: cdk.Construct, appName: string) {
        // user info table
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

        // concentration table
        const concentrationTable = new Table(substack, 'prod-concentration-table', {
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN,
            partitionKey: {name: 'name', type: AttributeType.STRING},
            tableName: 'prod-userConcentration'
        });

        // Location (by state) table
        const homeStateTable = new Table(substack, 'prod-home_state-table', {
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN,
            partitionKey: {name: 'name', type: AttributeType.STRING},
            tableName: 'prod-userHomeState'
        });

        // Interest table
        const interestTable = new Table(substack, 'prod-interest-table', {
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN,
            partitionKey: {name: 'name', type: AttributeType.STRING},
            tableName: 'prod-userInterest'
        });

        // Instrument table
        const instrumentTable = new Table(substack, 'prod-instrument-table', {
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN,
            partitionKey: {name: 'name', type: AttributeType.STRING},
            tableName: 'prod-userInstrument'
        });

        // Varsity sport table
        const varsitySportTable = new Table(substack, 'prod-varsity_sport-table', {
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN,
            partitionKey: {name: 'name', type: AttributeType.STRING},
            tableName: 'prod-userVarsitySport'
        });

        // Pickup sport table
        const pickupSportTable = new Table(substack, 'prod-pickup_sport-table', {
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN,
            partitionKey: {name: 'name', type: AttributeType.STRING},
            tableName: 'prod-userPickupSport'
        });

        // Course table
        const courseTable = new Table(substack, 'prod-course-table', {
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN,
            partitionKey: {name: 'name', type: AttributeType.STRING},
            tableName: 'prod-userCourse'
        });
    }
}