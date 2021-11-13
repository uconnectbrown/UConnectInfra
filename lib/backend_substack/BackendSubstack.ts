import * as cdk from '@aws-cdk/core';
import { Ddb } from './Ddb';
import { Eb } from './Eb';

export class BackendSubstack extends cdk.NestedStack {
    eb: Eb;
    ddb: Ddb;

    constructor(scope: cdk.Construct, id: string, props?: cdk.NestedStackProps) {
        super(scope, id, props);

        this.eb = new Eb(this, id);
        this.ddb = new Ddb(this, id);
    }
}