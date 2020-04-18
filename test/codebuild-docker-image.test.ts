import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { CodebuildDockerImageStack } from '../lib/codebuild-docker-image-stack';

test('Empty Stack', () => {
  // const app = new cdk.App();
  // // WHEN
  // const props = {
  //   s3StackName: 's3Stack',
  //   snsStackName: 'snsStackName',
  //   ecrName: 'image',
  // };
  // const stack = new CodebuildDockerImageStack(app, 'MyTestStack', props);
  // // THEN
  // expectCDK(stack).to(
  //   matchTemplate(
  //     {
  //       Resources: {},
  //     },
  //     MatchStyle.EXACT
  //   )
  // );
});
