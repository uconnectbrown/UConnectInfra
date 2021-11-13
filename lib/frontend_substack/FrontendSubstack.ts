import * as cdk from '@aws-cdk/core';

export class FrontendSubstack extends cdk.NestedStack {

    constructor(scope: cdk.Construct, id: string, props?: cdk.NestedStackProps) {
        super(scope, id, props);
    }
}