// winston-sns
// -----------
// ## A [Winston](https://github.com/flatiron/winston) Transport for sending amazon sns messages.
// (C) 2012, Jesse Ditson
// MIT License

// Dependencies
// ------------

var _ = require('underscore'),
	awssum = require('awssum'),
	winston = require('winston'),
	util = require('util');

// Local (Private) Variables
// -------------------------

// required variables - winston-sns will not start without at least these options.
var required = ["aws_key","aws_secret","subscriber","topic_arn"],
// optional variables (and their default values)
	optional = {
		// region - one of: "us-east-1","us-west-1","eu-west-1","ap-southeast-1","ap-northeast-1","us-gov-west-1","sa-east-1".
		"region" : "us-east-1",
		// default title for notification
		"subject" : "Winston Error Report",
		// default message for notification (%l is the level, %e is the error text, %m is the metadata.)
		"message" : "Level '%l' Error:\n%e\n\nMetadata:\n%m",
		// standard winston variables
		"level" : "info"
	};

// SNS Class
// ---------

var SNS = winston.transports.SNS = exports.SNS = function(options){
	// make sure we have the minimum required options
	var missing = [];
	required.forEach(function(r){
		if(!options.hasOwnProperty(r)) missing.push(r);
	});
	if(missing.length) throw "You must specify options: " + missing.join(",") + " to use winston-sns.";
	// fill in optional options, and set an options object.
	this.options = o = _.defaults(options,optional);
	// set up sns service
	this.sns = new (awssum.load('amazon/sns'))(o.aws_key,o.aws_secret,o.subscriber,o.region);
	// give this fucker a name
	this.name = "SNSTransport";
}

// Inherit Winston's transport protocols
util.inherits(SNS,winston.Transport);

// Public Methods
// --------------

// logging method that is exposed to Winston.
SNS.prototype.log = function(level,msg,meta,callback){
	// set up the message, substitute variables.
	var message = this.options.message;
	message = message.replace('%l',level);
	message = message.replace('%e',msg);
	// TODO: evaluate if setting this depth this big is a bad idea.
	message = message.replace('%m',util.inspect(meta,false,10));
	
	// set up options for the sns
	var snsOpts = {
		TopicArn : this.options.topic_arn,
		Subject : this.options.subject,
		Message : message
	}
	// send it off!
	this.sns.Publish(snsOpts,function(err,data){
		// might just be able to pass the callback directly into sns, but let's be nice and return a bool.
		callback(err,!!data);
	});
}