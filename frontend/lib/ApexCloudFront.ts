import {Construct} from "@aws-cdk/core";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as cdk from "@aws-cdk/core";
import * as route53 from "@aws-cdk/aws-route53";
import * as targets from "@aws-cdk/aws-route53-targets";
import * as s3 from "@aws-cdk/aws-s3";
import {StaticSiteProps} from "./UConnectFrontendInfraStack";

export interface CloudFrontProps {
    staticSiteProps: StaticSiteProps,
    viewerCertificate: cloudfront.ViewerCertificate,
    siteBucket: s3.Bucket,
    cloudfrontOAI: cloudfront.OriginAccessIdentity,
}

export class ApexCloudFront {
    constructor(substack: Construct, stackName: string, props: CloudFrontProps) {
        const siteDomain = props.staticSiteProps.siteSubDomain == '' ?
            props.staticSiteProps.domainName : `${props.staticSiteProps.siteSubDomain}.${props.staticSiteProps.domainName}`;

        const distribution = new cloudfront.CloudFrontWebDistribution(substack, `${siteDomain}CloudFront`, {
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
        new cdk.CfnOutput(substack, `${siteDomain}DistributionId`, {value: distribution.distributionId});

        // Route53 alias record for the ApexCloudFront distribution
        new route53.ARecord(substack, `${siteDomain}SiteAliasRecord`, {
            recordName: siteDomain,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
            zone: props.staticSiteProps.hostedZone
        });
    }
}