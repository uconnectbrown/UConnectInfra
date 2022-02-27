import * as cdk from '@aws-cdk/core';
import {UserTables} from "./UserTables";
import {EventBoardTables} from "./EventBoardTables";
import {CounterTable} from "./CounterTable";
import {EmailVerificationTable} from "./EmailVerificationTable";

export class Ddb {
    userTables: UserTables;
    emailVerificationTable: EmailVerificationTable;
    eventBoardTables: EventBoardTables;
    counterTable: CounterTable;

    constructor(substack: cdk.Construct, appName: string) {
        this.userTables = new UserTables(substack, appName);
        this.emailVerificationTable = new EmailVerificationTable(substack, appName);
        this.eventBoardTables = new EventBoardTables(substack, appName);
        this.counterTable = new CounterTable(substack, appName);
    }
}