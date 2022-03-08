import * as cdk from '@aws-cdk/core';
import {Bucket} from "./Bucket";
import {ViewerCertificate} from "./ViewerCertificate";
import {CloudFront, CloudFrontProps} from "./CloudFront";

export interface StaticSiteProps {
    domainName: string;
    siteSubDomain: string;
}

export class UConnectFrontendInfraStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const frontendId = 'UConnectFrontend';

        // TODO: fill out
        const domainName = 'uconnectbrown.com';
        const siteSubDomain = '';
        const staticSiteProps = {domainName: domainName, siteSubDomain: siteSubDomain};

        const bucket = new Bucket(this, frontendId, staticSiteProps);
        const viewerCertificate = new ViewerCertificate(this, frontendId, staticSiteProps);
        const cloudFront = new CloudFront(this, frontendId, <CloudFrontProps>{
            staticSiteProps: staticSiteProps,
            viewerCertificate: viewerCertificate.certificate,
            siteBucket: bucket.siteBucket,
            cloudfrontOAI: bucket.cloudfrontOAI
        });
    }
}
