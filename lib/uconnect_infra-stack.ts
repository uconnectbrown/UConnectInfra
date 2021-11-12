import * as cdk from '@aws-cdk/core';
import s3assets = require('@aws-cdk/aws-s3-assets')
import elasticbeanstalk = require('@aws-cdk/aws-elasticbeanstalk');
import iam = require('@aws-cdk/aws-iam');

export class UConnectInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appName = 'UConnectBackend';
    const app = new elasticbeanstalk.CfnApplication(this, 'Application', {
      applicationName: appName,
    });

    // Create role and instance profile
    const myRole = new iam.Role(this, `${appName}-aws-elasticbeanstalk-ec2-role`, {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    const managedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier')
    myRole.addManagedPolicy(managedPolicy);

    const myProfileName = `${appName}-InstanceProfile`

    const instanceProfile = new iam.CfnInstanceProfile(this, myProfileName, {
      instanceProfileName: myProfileName,
      roles: [
          myRole.roleName
      ]
    });

    const optionSettingProperties: elasticbeanstalk.CfnEnvironment.OptionSettingProperty[] = [
      {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'IamInstanceProfile',
          value: myProfileName,
      },
      {
          namespace: 'aws:autoscaling:asg',
          optionName: 'MinSize',
          value: '1',
      },
      {
          namespace: 'aws:autoscaling:asg',
          optionName: 'MaxSize',
          value: '1',
      },
      {
          namespace: 'aws:ec2:instances',
          optionName: 'InstanceTypes',
          value: 't2.micro',
      },
    ];

    // Create an Elastic Beanstalk environment for pre prod
    const preProdEnv = new elasticbeanstalk.CfnEnvironment(this, 'Environment', {
      environmentName: appName + '-pre-prod',
      applicationName: app.applicationName || appName,
      solutionStackName: "64bit Amazon Linux 2 v3.2.7 running Corretto 8",
      optionSettings: optionSettingProperties,
    });
  }
}
