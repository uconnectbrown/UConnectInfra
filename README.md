# Infrastructure for UConnect

## Deployment steps
 * (if you have multiple AWS accounts in ~/.aws/config) `export AWS_PROFILE=<profile-name-for-uconnect>`
 * `npm run build`
 * `cdk bootstrap`
 * `cdk synth`
 * `cdk deploy`

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
