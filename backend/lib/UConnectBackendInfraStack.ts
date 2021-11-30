import * as cdk from '@aws-cdk/core';
import {Eb} from "./Eb";
import {Ddb} from "./Ddb";

export class UConnectBackendInfraStack extends cdk.Stack {
  eb: Eb;
  ddb: Ddb;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const backendId = 'UConnectBackend';
    this.eb = new Eb(this, backendId);
    this.ddb = new Ddb(this, backendId);
  }
}
