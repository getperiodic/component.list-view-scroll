'use strict';

var listViewScroll = require('../../../index'),
	request = require('superagent'),
	events = require('events'),
	util = require('util');


var webapp = function(options){
	var componentData=false,
		componentTemplate=false,
		componentHTML = false,
		componentJSON = '',
		self = this;


	events.EventEmitter.call(this);

	this.grabData = function(url,callback){
		request.get(url)
			.end(function(err, res){
		  	if(err) {
		  		callback(err,null);
		  	}
		  	else{
				componentData = res.body;
				callback(null,componentData);
				self.emit("grabbedData");
		  	};
		});
	}

	this.grabTemplate = function(templateString,callback){
		componentTemplate = templateString;
		callback(null,componentTemplate);
		this.emit("grabbedTemplate");
	}

	this.getComponentSpec= function(){
		return componentData;
	}

}

util.inherits(webapp,events.EventEmitter);
module.exports = new webapp();
