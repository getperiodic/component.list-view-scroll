'use strict';

var listViewScroll = require('../../../index'),
	async = require('async'),
	webapp = require('./webapp');

window.onload = function(){
	async.parallel({
	    template: function(callback){
	    	webapp.grabTemplate(window.document.getElementById('component-template').innerHTML,callback);
	    },
	    componentData: function(callback){
            webapp.grabData(callback)
	    }
	},
	function(err, results) {
		console.log(results)
	    // results is now equals to: {one: 1, two: 2}
	});
}

webapp.on("loadedTemplate",function(){
	console.log("Render")
	webapp.render();
})

webapp.on("loadedJSONData",function(){
	console.log("loaded data")
})
webapp.on("grabbedTemplate",function(){
	console.log("loaded template")
})