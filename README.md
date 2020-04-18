# codebuild-docker-image

Manage CodeBuild projects to build docker images.
Other resources such as CodePipeline and ECR repositories are also created.
Stacks for CodeBuild are created for each directories under the `dockerfiles` directory.
The source of CodeBuild created is a S3 bucket.

## Example

Create a directory for Dockerfile.

```sh
$ mkdir dockerfiles/sample1
$ cat <<EOD >dockerfiles/sample1/Dockerfile
FROM ubuntu:18.04

CMD ["echo", "Hello, World!"]
EOD
```

Create a Dockerfile.zip.

```sh
$ (cd dockerfiles/sample1/ && find . -type f | zip Dockerfile.zip -@)
```

Deploy.

```sh
$ npm run build
$ npx cdk synth
$ npx cdk deploy CodebuildDockerImageStack*
```

Display the S3 url of CodeBuild source.

```sh
$ aws cloudformation describe-stacks --stack-name CodebuildDockerImageStack-sample1 --query 'map(&Outputs, Stacks)[] | [?OutputKey==`SourceS3Path`] | [0].OutputValue' --output text
```

Upload Dockerfile.zip to the source bucket.

```sh
$ source_s3=$(aws cloudformation describe-stacks --stack-name CodebuildDockerImageStack-sample1 --query 'map(&Outputs, Stacks)[] | [?OutputKey==`SourceS3Path`] | [0].OutputValue' --output text)
$ aws s3 cp dockerfiles/sample1/Dockerfile.zip $source_s3
```

This triggers CodePipeline.
