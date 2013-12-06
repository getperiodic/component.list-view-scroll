
/*
 * list-view-scroll
 * http://github.amexpub.com/modules
 *
 * Copyright (c) 2013 Amex Pub. All rights reserved.
 */

/**
 * cbpScroller.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */

'use strict';
var classie = require('classie'),
	extend = require('util-extend'),
	ejs = require('ejs'),
	events = require('events'),
	util = require('util');

var listViewOnScroll = function(config){
	var defaults,
		options,
		didScroll,
		el,
		sections,
		self = this,
		docElem = window.document.documentElement;
		events.EventEmitter.call(this);
	this.init = function(options) {
		// console.log("beforee options",options);
		options = options || {};
		defaults = {
			// The viewportFactor defines how much of the appearing item has to be visible in order to trigger the animation
			// if we'd use a value of 0, this would mean that it would add the animation class as soon as the item is in the viewport. 
			// If we were to use the value of 1, the animation would only be triggered when we see all of the item in the viewport (100% of it)
			viewportFactor : 0.2,
			idSelector: 'p_c_lvs-id',
			sectionClass: 'p_c_lvs-section'
		};
		options = extend( defaults,options );
		// console.log("options",options);
		didScroll = false,
		el = document.getElementById( options.idSelector ),
		sections = el.getElementsByClassName( options.sectionClass );

		if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
			// console.log("has touch");
			return;
		}

		function scrollHandler() {
			if( !didScroll ) {
				didScroll = true;
				setTimeout( function() { _scrollPage(options); }, 60 );
			}
		}

		function resizeHandler(){
			function delayed() {
				_scrollPage(options);
				resizeTimeout = null;
			}

			var resizeTimeout = setTimeout( delayed, 60 );

			if ( resizeTimeout ) {
				clearTimeout( resizeTimeout );
			}
		}

		window.addEventListener( 'scroll', scrollHandler.bind(this), false );
		window.addEventListener( 'resize', resizeHandler.bind(this), false );
	};

	function _getViewportH() {
		var client = docElem.clientHeight,
			inner = window.innerHeight;
		if( client < inner ){
			return inner;
		}
		else{
			return client;
		}
	}

	function _scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	// http://stackoverflow.com/a/5598797/989439
	function _getOffset( el ) {
		var offsetTop = 0, offsetLeft = 0;
		do {
			if ( !isNaN( el.offsetTop ) ) {
				offsetTop += el.offsetTop+el.offsetParent.offsetTop;
			}
			if ( !isNaN( el.offsetLeft ) ) {
				offsetLeft += el.offsetLeft+el.offsetParent.offsetLeft;
			}
		} while( el === el.offsetParent ); //changed for linting

		return {
			top : offsetTop,
			left : offsetLeft
		};
	}

	function _inViewport( el, h ) {
		var elH = el.offsetHeight,
			scrolled = _scrollY(),
			viewed = scrolled + _getViewportH(),
			elTop = _getOffset(el).top,
			elBottom = elTop + elH;

			// if 0, the element is considered in the viewport as soon as it enters.
			// if 1, the element is considered in the viewport only when it's fully inside
			// value in percentage (1 >= h >= 0)
			h = h || 0;

		return (elTop + elH * h) <= viewed && (elBottom) >= scrolled;
	}
	function _scrollPage(options) {
		for(var x in sections){
			if( _inViewport( sections[x], options.viewportFactor ) && (typeof sections[x] === "object")) {
				classie.add( sections[x], 'p_c_lvs-animate' );
				self.emit("sectionInView",x);
			}
			else {
				// this add class init if it doesn't have it. This will ensure that the items initially in the viewport will also animate on scroll
				if(typeof sections[x] === "object"){
					classie.add( sections[x], 'p_c_lvs-init' );
					classie.remove( sections[x], 'p_c_lvs-animate' );
					self.emit("sectionOutView",x);
				}
			}
		}

		didScroll = false;
	}
};

util.inherits(listViewOnScroll,events.EventEmitter);

listViewOnScroll.prototype.render = function(template,data,element){
	var componentHTML = ejs.render(template,data);
	document.getElementById(element).innerHTML = componentHTML;
	this.emit("renderedComponent");
};

module.exports = listViewOnScroll;