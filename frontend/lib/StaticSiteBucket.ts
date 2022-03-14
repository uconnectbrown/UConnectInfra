import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as iam from '@aws-cdk/aws-iam';
import {StaticSiteProps} from "./UConnectFrontendInfraStack";

/**
 * S3 bucket that contains the frontend static content
 */
export class StaticSiteBucket {
    public siteBucket: s3.IBucket;
    public cloudfrontOAI: cloudfront.OriginAccessIdentity;

    constructor(substack: cdk.Construct, stackName: string, props: StaticSiteProps) {
        const siteDomain = props.siteSubDomain == '' ? props.domainName : `${props.siteSubDomain}.${props.domainName}`;
        this.cloudfrontOAI = new cloudfront.OriginAccessIdentity(substack, `${siteDomain}-cloudfront-OAI`, {
            comment: `CloudFront OAI for ${siteDomain} in stack ${stackName}`
        });

        new cdk.CfnOutput(substack, `${siteDomain} URL`, {value: 'https://' + siteDomain});

        // Content bucket
        this.siteBucket = new s3.Bucket(substack, `${stackName}-${siteDomain}-bucket`, {
            bucketName: siteDomain,
            websiteIndexDocument: 'index.html',
            // use react router to handle errors
            // TODO: fix later for SEO (https://hackernoon.com/hosting-static-react-websites-on-aws-s3-cloudfront-with-ssl-924e5c134455)
            websiteErrorDocument: 'index.html',
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,

            removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code

            /**
             * For sample purposes only, if you create an S3 bucket then populate it, stack destruction fails.  This
             * setting will enable full cleanup of the demo.
             */
            autoDeleteObjects: true, // NOT recommended for production code
        });
        // Grant access to cloudfront
        this.siteBucket.addToResourcePolicy(new iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [this.siteBucket.arnForObjects('*')],
            principals: [new iam.CanonicalUserPrincipal(this.cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        }));
        new cdk.CfnOutput(substack, `${siteDomain}BucketName`, {value: this.siteBucket.bucketName});
    }
}