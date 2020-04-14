import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class S3Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'SourceS3Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
    });

    new cdk.CfnOutput(this, 'SourceS3BucketName', {
      value: bucket.bucketName,
      description: 'Source S3 bucket.',
      exportName: `${this.stackName}-SourceS3BucketName`,
    });
  }
}
