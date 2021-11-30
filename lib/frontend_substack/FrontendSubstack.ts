import * as cdk from '@aws-cdk/core';
import {Bucket} from "./Bucket";
import {ViewerCertificate} from "./ViewerCertificate";
import {CloudFront} from "./CloudFront";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as s3 from "@aws-cdk/aws-s3";

export interface StaticSiteProps {
    domainName: string;
    siteSubDomain: string;
}

export class FrontendSubstack extends cdk.NestedStack {

    constructor(scope: cdk.Construct, id: string, props?: cdk.NestedStackProps) {
        super(scope, id, props);

        // TODO: fill out
        const domainName = '';
        const siteSubDomain = '';
        const staticSiteProps = {domainName: domainName, siteSubDomain: siteSubDomain};

        const bucket = new Bucket(this, id, staticSiteProps);
        const viewerCertificate = new ViewerCertificate(this, id, staticSiteProps);
        const cloudFront = new CloudFront(this, id, {
            staticSiteProps: staticSiteProps,
            viewerCertificate: viewerCertificate.certificate,
            siteBucket: bucket.siteBucket,
            cloudfrontOAI: bucket.cloudfrontOAI
        });
    }
}