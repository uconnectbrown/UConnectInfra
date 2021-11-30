import * as cdk from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as iam from '@aws-cdk/aws-iam';
import {StaticSiteProps} from './FrontendSubstack';

/**
 * S3 bucket that contains the frontend static content
 */
export class Bucket {
    public siteBucket: s3.Bucket;
    public cloudfrontOAI: cloudfront.OriginAccessIdentity;

    constructor(substack: cdk.Construct, stackName: string, props: StaticSiteProps) {
        // TODO: uncomment this after we transfer from godaddy to route53
        // const zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: props.domainName });
        const siteDomain = props.siteSubDomain == '' ? props.domainName : `${props.siteSubDomain}.${props.domainName}`;
        this.cloudfrontOAI = new cloudfront.OriginAccessIdentity(substack, 'cloudfront-OAI', {
            comment: `OAI for ${stackName}`
        });

        new cdk.CfnOutput(substack, 'Site', {value: 'https://' + siteDomain});

        // Content bucket
        this.siteBucket = new s3.Bucket(substack, `${stackName}-bucket`, {
            bucketName: siteDomain,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'error.html',
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
        new cdk.CfnOutput(substack, `${stackName}BucketName`, {value: this.siteBucket.bucketName});
    }
}