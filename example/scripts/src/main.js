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
		if(err){
			console.log(err);
		}
		webapp.render( results.template, results.componentData, "scrollerhtml");
	});
}

webapp.on("grabbedData",function(){
	console.log("loaded data")
});

webapp.on("grabbedTemplate",function(){
	console.log("loaded template")
});

webapp.on("renderedTemplate",function(){
	var listviewcroll1 =  listViewScroll( {el:document.getElementById( 'cbp-so-scroller' )} );
	listviewcroll1.init();

	console.log("rendered template");
});