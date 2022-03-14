import * as cdk from "@aws-cdk/core";
import {Construct} from "@aws-cdk/core";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import {OriginProtocolPolicy} from "@aws-cdk/aws-cloudfront";
import * as route53 from "@aws-cdk/aws-route53";
import * as targets from "@aws-cdk/aws-route53-targets";
import {CloudFrontProps} from "./ApexCloudFront";

export class RedirectCloudFront {
    constructor(substack: Construct, stackName: string, props: CloudFrontProps) {
        const siteDomain = props.staticSiteProps.siteSubDomain == '' ?
            props.staticSiteProps.domainName : `${props.staticSiteProps.siteSubDomain}.${props.staticSiteProps.domainName}`;

        const distribution = new cloudfront.CloudFrontWebDistribution(substack, `${siteDomain}CloudFront`, {
            viewerCertificate: props.viewerCertificate,
            originConfigs: [
                {
                    customOriginSource: {
                        // note the origin name is the bucket WEBSITE domain name
                        domainName: props.siteBucket.bucketWebsiteDomainName,
                        // must be HTTP only for redirect
                        originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
                    },
                    behaviors: [{
                        isDefaultBehavior: true,
                    }],
                }
            ],
            // overwrite, default to index.html if this line is absent
            defaultRootObject: "",
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