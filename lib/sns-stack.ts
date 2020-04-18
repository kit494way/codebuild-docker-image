import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';

export class SNSStack extends cdk.Stack {
  public topic: sns.Topic;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.topic = new sns.Topic(this, 'SNSTopic', {
      displayName: 'codebuild-docker-image-topic',
    });

    // Allow CodePipeline to publish to the topic.
    const policy = new iam.PolicyStatement();
    policy.addServicePrincipal('codestar-notifications.amazonaws.com');
    policy.addActions('SNS:Publish');
    policy.addResources(this.topic.topicArn);
    this.topic.addToResourcePolicy(policy);
  }
}
