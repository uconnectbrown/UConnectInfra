import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import {StaticSiteProps} from "./UConnectFrontendInfraStack";

/**
 * Empty S3 bucket that redirects this subdomain visits to the apex domain
 */
export class RedirectBucket {
    public siteBucket: s3.IBucket;

    constructor(substack: cdk.Construct, stackName: string, props: StaticSiteProps) {
        const siteDomain = props.siteSubDomain == '' ? props.domainName : `${props.siteSubDomain}.${props.domainName}`;

        new cdk.CfnOutput(substack, `${siteDomain} URL`, {value: 'https://' + siteDomain});

        // Empty bucket for redirect to apex only
        this.siteBucket = new s3.Bucket(substack, `${stackName}-${siteDomain}-bucket`, {
            bucketName: siteDomain,
            websiteRedirect: {
                hostName: props.domainName,
            },
            publicReadAccess: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });
        new cdk.CfnOutput(substack, `${siteDomain}BucketName`, {value: this.siteBucket.bucketName});
    }
}