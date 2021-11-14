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
          {
              namespace: 'aws:elasticbeanstalk:environment',
              optionName: 'EnvironmentType',
              value: 'LoadBalanced',
          },
          {
              namespace: 'aws:elasticbeanstalk:environment',
              optionName: 'LoadBalancerType',
              value: 'classic',
          },
          {
              namespace: 'aws:elb:listener:80',
              optionName: 'ListenerEnabled',
              value: 'false',
          },
          {
              namespace: 'aws:elb:listener:443',
              optionName: 'ListenerEnabled',
              value: 'true',
          },
          {
              namespace: 'aws:elb:listener:443',
              optionName: 'ListenerProtocol',
              value: 'HTTPS',
          },
          {
              namespace: 'aws:elb:listener:443',
              optionName: 'InstancePort',
              value: '80',
          },
          {
              namespace: 'aws:elb:listener:443',
              optionName: 'InstanceProtocol',
              value: 'HTTP',
          },
          {
              namespace: 'aws:elb:listener:443',
              optionName: 'SSLCertificateId',
              // self-signed placeholder for now
              value: 'arn:aws:acm:us-east-1:054005165999:certificate/9853d21b-80e8-484e-a97c-074116096b66',
          }
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