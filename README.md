An Amazon SNS transport for [winston][0].

## Installation

### Installing winston-sns via npm

``` sh
  $ npm install winston
  $ npm install winston-sns
```
(or add it to your package.json)

If you are running in an environment where `aws-sdk` is not installed globally, you might need to also install `aws-sdk`.

``` sh
  $ npm install aws-sdk
```

## Usage
``` js
  var winston = require('winston'),
      winstonSNS = require('winston-sns');

  winston.add(winstonSNS, options);
```

## Documentation

Annotated source can be generated using [docco](https://github.com/jashkenas/docco):
``` sh
	docco lib
```
note that you need pygments installed to use docco - you can install it on a mac by using:
``` sh
  easy_install pygments
```

The SNS transport uses [Amazon's AWS SDK for JavaScript](https://www.npmjs.com/package/aws-sdk) to generate Amazon SNS messages, so if you have a ~/.aws/credentials file, a AWS.config file, or are running on a EC2 instance that has a IAM role associated with it, you don't need to specify your AWS credentials. To read more about this, please see the Amazon Documentation on [Configuring the SDK in Node.js](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)

### Options
* __subscriber:__ Subscriber number - found in your SNS AWS Console, after clicking on a topic. Same as AWS Account ID. *[required]*
* __topic_arn:__ Also found in SNS AWS Console - listed under a topic as Topic ARN. *[required]*
* __aws_key:__ Your Amazon Web Services Key.
* __aws_secret:__ Your Amazon Web Services Secret.
* __region:__ AWS Region to use. Can be one of: `us-east-1`,`us-west-1`,`eu-west-1`,`ap-southeast-1`,`ap-northeast-1`,`us-gov-west-1`,`sa-east-1`. (default: `us-east-1`)
* __subject:__ Subject for notifications. Uses placeholders for level (%l), error message (%e), and metadata (%m). (default: "Winston Error Report")
* __message:__ Message of notifications. Uses placeholders for level (%l), error message (%e), and metadata (%m). (default: "Level '%l' Error:\n%e\n\nMetadata:\n%m")
* __level:__ lowest level this transport will log. (default: `info`)
* __json:__ use json instead of a prettier (human friendly) string for meta information in the notification. (default: `false`)
* __handleExceptions:__ set to true to have this transport handle exceptions. (default: `false`)
* __silent:__ Boolean flag indicating whether to suppress output (default: `false`)


Feel free to file issues in this github tracker, I check it often.

[0]: https://github.com/flatiron/winston
