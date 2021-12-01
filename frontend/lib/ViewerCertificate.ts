import * as cdk from '@aws-cdk/core';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cloudwatch from "@aws-cdk/aws-cloudwatch";
import {StaticSiteProps} from "./UConnectFrontendInfraStack";

export class ViewerCertificate {
    public certificate: cloudfront.ViewerCertificate;

    constructor(substack: cdk.Construct, stackName: string, props: StaticSiteProps) {
        const siteDomain = props.siteSubDomain == '' ? props.domainName : `${props.siteSubDomain}.${props.domainName}`;

        // TLS certificate
        // TODO: Uncomment after transferring from godaddy to route53
        // const certificateArn = new acm.DnsValidatedCertificate(substack, 'SiteCertificate', {
        //     domainName: siteDomain,
        //     hostedZone: zone,
        //     region: 'us-east-1', // Cloudfront only checks this region for certificates.
        // }).certificateArn;

        // TODO: manually create/upload cert to cert manager
        const certificateArn = 'arn:aws:acm:us-east-1:054005165999:certificate/76f37e34-cff6-4056-afe4-b92730b492d4';
        new cdk.CfnOutput(substack, `${stackName}ViewerCertificateArn`, {value: certificateArn});

        // Enforce HTTPS & TLS v1.1 to request objects
        this.certificate = cloudfront.ViewerCertificate.fromAcmCertificate(<acm.ICertificate>{
                certificateArn: certificateArn,
                env: {
                    region: 'us-east-1',
                    account: '054005165999'
                },
                node: substack.node,
                stack: substack,
            },
            {
                sslMethod: cloudfront.SSLMethod.SNI,
                securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
                aliases: [siteDomain]
            });
    }
}