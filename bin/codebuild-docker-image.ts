#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { S3Stack } from '../lib/s3-stack';
import { SNSStack } from '../lib/sns-stack';
import { CodebuildDockerImageStack } from '../lib/codebuild-docker-image-stack';

import * as fs from 'fs';

const app = new cdk.App();

const s3Stack = new S3Stack(app, 'CodebuildDockerImageS3Stack');
const snsStack = new SNSStack(app, 'CodebuildDockerImageSNSStack');

fs.readdirSync('./dockerfiles', { withFileTypes: true }).forEach((dirent) => {
  if (!dirent.isDirectory()) {
    return;
  }
  const stack = new CodebuildDockerImageStack(app, `CodebuildDockerImageStack-${dirent.name}`, {
    s3StackName: s3Stack.stackName,
    snsTopic: snsStack.topic,
    ecrName: dirent.name,
  });

  stack.addDependency(s3Stack);
});

app.synth();
