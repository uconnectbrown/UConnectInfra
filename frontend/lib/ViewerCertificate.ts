import * as cdk from '@aws-cdk/core';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as acm from '@aws-cdk/aws-certificatemanager';
import {StaticSiteProps} from "./UConnectFrontendInfraStack";

export class ViewerCertificate {
    public certificate: cloudfront.ViewerCertificate;

    constructor(substack: cdk.Construct, stackName: string, props: StaticSiteProps) {
        const siteDomain = props.siteSubDomain == '' ? props.domainName : `${props.siteSubDomain}.${props.domainName}`;

        // TLS certificate
        const certificateArn = new acm.DnsValidatedCertificate(substack, `${siteDomain}Certificate`, {
            domainName: siteDomain,
            hostedZone: props.hostedZone,
            region: 'us-east-1', // Cloudfront only checks this region for certificates.
        }).certificateArn;

        // old manually created certificate before switching from godaddy (uconnectbrown.com + www.uconnectbrown.com)
        // const certificateArn = 'arn:aws:acm:us-east-1:054005165999:certificate/a9ba0298-c49f-45cf-bde3-d7ae2161d587';
        new cdk.CfnOutput(substack, `${siteDomain}ViewerCertificateArn`, {value: certificateArn});

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