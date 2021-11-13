import * as cdk from '@aws-cdk/core';
import elasticbeanstalk = require('@aws-cdk/aws-elasticbeanstalk');
import iam = require('@aws-cdk/aws-iam');

export class Eb {
    constructor(substack: cdk.Construct, appName: string) {
        const app = new elasticbeanstalk.CfnApplication(substack, `${appName}Application`, {
          applicationName: appName,
        });
    
        // Create role and instance profile
        const ebRole = new iam.Role(substack, `${appName}-aws-elasticbeanstalk-ec2-role`, {
          assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        });
    
        const ebWebPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier')
        const s3Policy = iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess')
        const ddbPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')
        ebRole.addManagedPolicy(ebWebPolicy);
        ebRole.addManagedPolicy(s3Policy);
        ebRole.addManagedPolicy(ddbPolicy);
    
        const ebProfileName = `${appName}-InstanceProfile`
    
        const instanceProfile = new iam.CfnInstanceProfile(substack, ebProfileName, {
          instanceProfileName: ebProfileName,
          roles: [
              ebRole.roleName
          ]
        });
    
        const optionSettingProperties: elasticbeanstalk.CfnEnvironment.OptionSettingProperty[] = [
          {
              namespace: 'aws:autoscaling:launchconfiguration',
              optionName: 'IamInstanceProfile',
              value: ebProfileName,
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
        const preProdEnv = new elasticbeanstalk.CfnEnvironment(substack, 'PreProdEnvironment', {
          environmentName: appName + '-pre-prod',
          applicationName: app.applicationName || appName,
          solutionStackName: "64bit Amazon Linux 2 v3.2.7 running Corretto 8",
          optionSettings: optionSettingProperties,
        });
      }
}