import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as ecr from '@aws-cdk/aws-ecr';
import * as s3 from '@aws-cdk/aws-s3';

export interface CodebuildDockerImageStackProps extends cdk.StackProps {
  s3StackName: string;
  ecrName: string;
}

export class CodebuildDockerImageStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CodebuildDockerImageStackProps) {
    super(scope, id, props);

    const bucket = s3.Bucket.fromBucketName(
      this,
      'SourceS3Bucket',
      cdk.Fn.importValue(`${props.s3StackName}-SourceS3BucketName`)
    );

    const repository = new ecr.Repository(this, 'ECRRepository', {
      repositoryName: props.ecrName,
    });

    const projectName = `docker-image-${props.ecrName}`;
    const sourceS3Path = `${projectName}/Dockerfile.zip`;

    const project = new codebuild.Project(this, 'CodeBuildProject', {
      projectName,
      badge: false, // Not supported for source type S3.
      source: codebuild.Source.s3({ bucket, path: sourceS3Path }),
      cache: codebuild.Cache.local(
        codebuild.LocalCacheMode.DOCKER_LAYER,
        codebuild.LocalCacheMode.CUSTOM
      ),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_4_0,
        environmentVariables: {
          AWS_ACCOUNT_ID: { value: this.account },
          IMAGE_REPO_NAME: { value: props.ecrName },
        },
        privileged: true, // Required to build Docker images.
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          pre_build: {
            commands: [
              'echo Logging in to Amazon ECR...',
              'if [ -n "${CODEBUILD_SOURCE_VERSION}" ]; then export IMAGE_TAG="v-${CODEBUILD_SOURCE_VERSION}"; else export IMAGE_TAG=""; fi',
              'aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin https://${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com',
            ]
          },
          build: {
            commands: [
              'echo Build started on `date`',
              'echo Building the Docker image...',
              'docker image build -t ${IMAGE_REPO_NAME}:latest .',
              'docker image tag ${IMAGE_REPO_NAME}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}:latest',
              'if [ -n "${IMAGE_TAG}" ]; then docker image tag ${IMAGE_REPO_NAME}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}:${IMAGE_TAG}; fi',
            ],
          },
          post_build: {
            commands: [
              'echo Build completed on `date`',
              'echo Pushing the Docker image...',
              'docker image push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}:latest',
              'if [ -n "${IMAGE_TAG}" ]; then docker image push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}:${IMAGE_TAG}; fi',
            ],
          },
        },
      })
    });

    repository.grantPullPush(project);

    new cdk.CfnOutput(this, 'SourceS3Path', {
      value: `s3://${bucket.bucketName}/${sourceS3Path}`,
      description: `Source S3 url of codebuild project ${projectName}.`,
    });
  }
}
