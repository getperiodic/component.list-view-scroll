'use strict';

var listViewScroll = require('../../../index'),
	async = require('async'),
	webapp = require('./webapp');

var module1 = webapp;
var module2 = webapp;

window.onload = function(){
	async.parallel({
	    template: function(callback){
	    	module1.grabTemplate(window.document.getElementById('component-template').innerHTML,callback);
	    },
	    componentData: function(callback){
            module1.grabData('https://s3.amazonaws.com/gpsampledata/component.list-view-scroll/contentspec.json',callback)
	    }
	},
	function(err, results) {
		if(err){
			console.log(err);
		}
		module1.render( results.template, results.componentData, "scrollerhtml");
	});
}

module1.on("grabbedData",function(){
	console.log("loaded data")
});

module1.on("grabbedTemplate",function(){
	console.log("loaded template")
});

module1.on("renderedTemplate",function(){
	var listviewcroll1 =  listViewScroll( {idSelector:module1.getComponentSpec().config.html.dom_id} );
	listviewcroll1.init();

	console.log("rendered template");
});