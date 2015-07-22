# winston-sns
# -----------
# ## A [Winston](https://github.com/flatiron/winston) Transport for sending amazon sns messages.
# (C) 2012, Jesse Ditson
# MIT License

_defaults = require 'lodash.defaults'
AWS = require 'aws-sdk'
winston = require 'winston'
util = require 'util'

module.exports =
class winston.transports.SNS extends winston.Transport
  name: 'SNSTransport'
  constructor: (options={}) ->
    super

    missing = required.filter (req) ->
      !options.hasOwnProperty(req)

    if missing.length
      throw new Error "winston-sns requires the following options: #{missing.join(',')}"

    @options = o = _defaults(options, optional)

    snsOpts =
      apiVersion: '2010-03-31'

    snsOpts.accessKeyId = o.aws_key if o.aws_key
    snsOpts.secretAccessKey = o.aws_secret if o.aws_secret
    snsOpts.region = o.region if o.region

    @sns = new AWS.SNS snsOpts

    @level = o.level
    @handleExceptions = o.handleExceptions if o.handleExceptions
    return

  log: (level, msg = '', meta, callback) ->
    if @silent
      return callback(null, true)

    json = @options.json

    sub = (str='') ->
      # TODO: evaluate if setting this depth this big is a bad idea.
      m = if json then JSON.stringify(meta) else util.inspect(meta, false, 10)
      str.replace('%l', level).replace('%e', msg).replace '%m', m

    snsOpts =
      Subject: sub(@options.subject)
      Message: sub(@options.message)
      TopicArn: @options.topic_arn

    @sns.publish snsOpts, (err, data) ->
      callback err, data

    return

  required = [
    'subscriber'
    'topic_arn'
  ]

  optional =
    'region': 'us-east-1'
    'subject': 'Winston Error Report'
    'message': 'Level \'%l\' Error:\n%e\n\nMetadata:\n%m'
    'level': 'info'
    'handleExceptions': false
    'json': false
    'silent': false
