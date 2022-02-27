import {AttributeType, BillingMode, ProjectionType, Table} from "@aws-cdk/aws-dynamodb";
import * as cdk from "@aws-cdk/core";
import {RemovalPolicy} from "@aws-cdk/core";

export class EventBoardTables {
    constructor(substack: cdk.Construct, appName: string) {
        // hidden event table
        const hiddenEventTable = new Table(substack, 'prod-eventBoardEvent-hidden', {
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN,
            partitionKey: {name: 'id', type: AttributeType.STRING},
            sortKey: {name: 'timestamp', type: AttributeType.STRING},
            tableName: 'prod-eventBoardEventHidden'
        });
        EventBoardTables.addEventTableGSIs(hiddenEventTable);

        // hidden comment table
        const hiddenCommentTable = new Table(substack, 'prod-eventBoardComment-hidden', {
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN,
            partitionKey: {name: 'id', type: AttributeType.STRING},
            sortKey: {name: 'timestamp', type: AttributeType.STRING},
            tableName: 'prod-eventBoardCommentHidden'
        });
        EventBoardTables.addCommentTableGSIs(hiddenCommentTable);

        // published event table
        const publishedEventTable = new Table(substack, 'prod-eventBoardEvent-published', {
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN,
            partitionKey: {name: 'id', type: AttributeType.STRING},
            sortKey: {name: 'timestamp', type: AttributeType.STRING},
            tableName: 'prod-eventBoardEventPublished'
        });
        EventBoardTables.addEventTableGSIs(publishedEventTable);

        // published comment table
        const publishedCommentTable = new Table(substack, 'prod-eventBoardComment-published', {
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN,
            partitionKey: {name: 'id', type: AttributeType.STRING},
            sortKey: {name: 'timestamp', type: AttributeType.STRING},
            tableName: 'prod-eventBoardCommentPublished'
        });
        EventBoardTables.addCommentTableGSIs(publishedCommentTable);
    }

    private static addEventTableGSIs(table: Table): void {
        // GSI info must match with up with Event.java in UConnectBackend repo
        table.addGlobalSecondaryIndex({
            indexName: 'authorIndex',
            partitionKey: {name: 'author', type: AttributeType.STRING},
            sortKey: {name: 'timestamp', type: AttributeType.STRING},
            projectionType: ProjectionType.ALL
        });

        table.addGlobalSecondaryIndex({
            indexName: 'hostIndex',
            partitionKey: {name: 'host', type: AttributeType.STRING},
            sortKey: {name: 'timestamp', type: AttributeType.STRING},
            projectionType: ProjectionType.ALL
        });

        table.addGlobalSecondaryIndex({
            indexName: 'titleIndex',
            partitionKey: {name: 'title', type: AttributeType.STRING},
            sortKey: {name: 'timestamp', type: AttributeType.STRING},
            projectionType: ProjectionType.ALL
        });

        table.addGlobalSecondaryIndex({
            indexName: 'indexIndex',
            partitionKey: {name: 'index', type: AttributeType.NUMBER},
            projectionType: ProjectionType.ALL
        });
    }

    private static addCommentTableGSIs(table: Table): void {
        table.addGlobalSecondaryIndex({
            indexName: 'authorIndex',
            partitionKey: {name: 'author', type: AttributeType.STRING},
            sortKey: {name: 'timestamp', type: AttributeType.STRING},
            projectionType: ProjectionType.ALL
        });

        table.addGlobalSecondaryIndex({
            indexName: 'parentIdIndex',
            partitionKey: {name: 'parentId', type: AttributeType.NUMBER},
            sortKey: {name: 'timestamp', type: AttributeType.STRING},
            projectionType: ProjectionType.ALL
        });
    }
}