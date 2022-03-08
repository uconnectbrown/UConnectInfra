import {Construct} from "@aws-cdk/core";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as cdk from "@aws-cdk/core";
import * as route53 from "@aws-cdk/aws-route53";
import * as s3 from "@aws-cdk/aws-s3";
import {StaticSiteProps} from "./UConnectFrontendInfraStack";

export interface CloudFrontProps {
    staticSiteProps: StaticSiteProps,
    viewerCertificate: cloudfront.ViewerCertificate,
    siteBucket: s3.Bucket,
    cloudfrontOAI: cloudfront.OriginAccessIdentity
}

export class CloudFront {
    constructor(substack: Construct, stackName: string, props: CloudFrontProps) {
        const distribution = new cloudfront.CloudFrontWebDistribution(substack, `${stackName}CloudFront`, {
            viewerCertificate: props.viewerCertificate,
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: props.siteBucket,
                        originAccessIdentity: props.cloudfrontOAI
                    },
                    behaviors: [{
                        isDefaultBehavior: true,
                        compress: true,
                        allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
                    }],
                }
            ],
            errorConfigurations: [
                {
                    errorCode: 403,
                    errorCachingMinTtl: 86400,
                    responsePagePath: "/index.html",
                    responseCode: 200
                }
            ]
        });
        new cdk.CfnOutput(substack, `${stackName}DistributionId`, {value: distribution.distributionId});

        // Route53 alias record for the CloudFront distribution
        // TODO: uncomment and fix after transferring from godaddy
        // TODO: before transferring, manually create record
        // new route53.ARecord(substack, `${stackName}SiteAliasRecord`, {
        //     recordName: props.staticSiteProps.siteDomain,
        //     target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
        //     zone
        // });
    }
}