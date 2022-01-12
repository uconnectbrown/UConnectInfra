import * as cdk from "@aws-cdk/core";
import * as s3 from '@aws-cdk/aws-s3';

export class Bucket {
    public bucket: s3.IBucket;

    constructor(substack: cdk.Construct, appName: string) {
        this.bucket = new s3.Bucket(substack, `uconnect-media-bucket`, {
            bucketName: 'uconnect-media-bucket',
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
        });
    }
}