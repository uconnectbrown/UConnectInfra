import * as cdk from '@aws-cdk/core';
import {StaticSiteBucket} from "./StaticSiteBucket";
import {ViewerCertificate} from "./ViewerCertificate";
import {ApexCloudFront, CloudFrontProps} from "./ApexCloudFront";
import * as route53 from "@aws-cdk/aws-route53";
import {IHostedZone} from "@aws-cdk/aws-route53";
import {RedirectBucket} from "./RedirectBucket";
import {RedirectCloudFront} from "./RedirectCloudFront";

export interface StaticSiteProps {
    domainName: string,
    siteSubDomain: string,
    hostedZone: IHostedZone,
}

export class UConnectFrontendInfraStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const frontendId = 'UConnectFrontend';

        const domainName = 'uconnectbrown.com';

        const uconnectbrownHostedZone = route53.HostedZone.fromLookup(this, 'uconnectbrownHostedZone',
            {domainName: domainName});

        const apexSiteProps = {
            domainName: domainName,
            siteSubDomain: "",
            hostedZone: uconnectbrownHostedZone
        }
        const wwwRedirectSiteProps = {
            domainName: domainName,
            siteSubDomain: "www",
            hostedZone: uconnectbrownHostedZone
        }

        const apexBucket = new StaticSiteBucket(this, frontendId, apexSiteProps);
        const apexViewerCertificate = new ViewerCertificate(this, frontendId, apexSiteProps);
        const apexCloudFront = new ApexCloudFront(this, frontendId, <CloudFrontProps>{
            staticSiteProps: apexSiteProps,
            viewerCertificate: apexViewerCertificate.certificate,
            siteBucket: apexBucket.siteBucket,
            cloudfrontOAI: apexBucket.cloudfrontOAI,
        });

        const wwwBucket = new RedirectBucket(this, frontendId, wwwRedirectSiteProps);
        const wwwViewerCertificate = new ViewerCertificate(this, frontendId, wwwRedirectSiteProps);
        const wwwCloudFront = new RedirectCloudFront(this, frontendId, <CloudFrontProps>{
            staticSiteProps: wwwRedirectSiteProps,
            viewerCertificate: wwwViewerCertificate.certificate,
            siteBucket: wwwBucket.siteBucket,
        })
    }
}
