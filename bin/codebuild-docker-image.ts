#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CodebuildDockerImageStack } from '../lib/codebuild-docker-image-stack';

const app = new cdk.App();
new CodebuildDockerImageStack(app, 'CodebuildDockerImageStack');
