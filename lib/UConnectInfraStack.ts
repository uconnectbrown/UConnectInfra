import * as cdk from '@aws-cdk/core';
import { BackendSubstack } from './backend_substack/BackendSubstack';
import { FrontendSubstack } from './frontend_substack/FrontendSubstack';

export class UConnectInfraStack extends cdk.Stack {
  backend: BackendSubstack;
  frontend: FrontendSubstack;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const backendId = 'UConnectBackend';
    const frontendId = 'UConnectFrontend';

    this.backend = new BackendSubstack(this, backendId);
    this.frontend = new FrontendSubstack(this, frontendId);
  }
}
