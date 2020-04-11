import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import CodebuildDockerImage = require('../lib/codebuild-docker-image-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CodebuildDockerImage.CodebuildDockerImageStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
