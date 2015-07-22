(function() {
  var AWS, util, winston, _defaults,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _defaults = require('lodash.defaults');

  AWS = require('aws-sdk');

  winston = require('winston');

  util = require('util');

  module.exports = winston.transports.SNS = (function(_super) {
    var optional, required;

    __extends(SNS, _super);

    SNS.prototype.name = 'SNSTransport';

    function SNS(options) {
      var missing, o, snsOpts;
      if (options == null) {
        options = {};
      }
      SNS.__super__.constructor.apply(this, arguments);
      missing = required.filter(function(req) {
        return !options.hasOwnProperty(req);
      });
      if (missing.length) {
        throw new Error("winston-sns requires the following options: " + (missing.join(',')));
      }
      this.options = o = _defaults(options, optional);
      snsOpts = {
        apiVersion: '2010-03-31'
      };
      if (o.aws_key) {
        snsOpts.accessKeyId = o.aws_key;
      }
      if (o.aws_secret) {
        snsOpts.secretAccessKey = o.aws_secret;
      }
      if (o.region) {
        snsOpts.region = o.region;
      }
      this.sns = new AWS.SNS(snsOpts);
      this.level = o.level;
      if (o.handleExceptions) {
        this.handleExceptions = o.handleExceptions;
      }
      return;
    }

    SNS.prototype.log = function(level, msg, meta, callback) {
      var json, snsOpts, sub;
      if (msg == null) {
        msg = '';
      }
      if (this.silent) {
        return callback(null, true);
      }
      json = this.options.json;
      sub = function(str) {
        var m;
        if (str == null) {
          str = '';
        }
        m = json ? JSON.stringify(meta) : util.inspect(meta, false, 10);
        return str.replace('%l', level).replace('%e', msg).replace('%m', m);
      };
      snsOpts = {
        Subject: sub(this.options.subject),
        Message: sub(this.options.message),
        TopicArn: this.options.topic_arn
      };
      this.sns.publish(snsOpts, function(err, data) {
        return callback(err, data);
      });
    };

    required = ['subscriber', 'topic_arn'];

    optional = {
      'region': 'us-east-1',
      'subject': 'Winston Error Report',
      'message': 'Level \'%l\' Error:\n%e\n\nMetadata:\n%m',
      'level': 'info',
      'handleExceptions': false,
      'json': false,
      'silent': false
    };

    return SNS;

  })(winston.Transport);

}).call(this);
