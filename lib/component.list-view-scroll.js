
/*
 * Alist-view-on-scroll
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

var Modernizr = require('browsernizr'),
	classie = require('classie'),
	extend = require('util-extend');

var docElem = window.document.documentElement;

function getViewportH() {
	var client = docElem.clientHeight,
		inner = window.innerHeight;
	if( client < inner ){
		return inner;
	}
	else{
		return client;
	}
}

function scrollY() {
	return window.pageYOffset || docElem.scrollTop;
}

// http://stackoverflow.com/a/5598797/989439
function getOffset( el ) {
	var offsetTop = 0, offsetLeft = 0;
	do {
		if ( !isNaN( el.offsetTop ) ) {
			offsetTop += el.offsetTop;
		}
		if ( !isNaN( el.offsetLeft ) ) {
			offsetLeft += el.offsetLeft;
		}
	} while( el === el.offsetParent ); //changed for linting

	return {
		top : offsetTop,
		left : offsetLeft
	};
}

function inViewport( el, h ) {
	var elH = el.offsetHeight,
		scrolled = scrollY(),
		viewed = scrolled + getViewportH(),
		elTop = getOffset(el).top,
		elBottom = elTop + elH;
		// if 0, the element is considered in the viewport as soon as it enters.
		// if 1, the element is considered in the viewport only when it's fully inside
		// value in percentage (1 >= h >= 0)
		h = h || 0;

	return (elTop + elH * h) <= viewed && (elBottom) >= scrolled;
}


function listViewOnScroll(options){
	var el = options.el,
		defaults = {
			// The viewportFactor defines how much of the appearing item has to be visible in order to trigger the animation
			// if we'd use a value of 0, this would mean that it would add the animation class as soon as the item is in the viewport. 
			// If we were to use the value of 1, the animation would only be triggered when we see all of the item in the viewport (100% of it)
			viewportFactor : 0.2
		},
		sections = Array.prototype.slice.call( el.querySelectorAll( '.p_c_lvs-section' ) ),
		didScroll = false;

	options = extend( options, defaults );
	console.log("in list view scroll afer extend",options);

	function _init() {
		if( Modernizr.touch ) {return;}


		// the sections already shown...
		sections.forEach( function( el, i ) {
			if( !inViewport( el ) ) {
				classie.add( el, 'cbp-so-init' );
			}
		} );

		function scrollHandler() {
			if( !didScroll ) {
				didScroll = true;
				setTimeout( function() { _scrollPage(); }, 60 );
			}
		}
		function resizeHandler(){
			function delayed() {
				_scrollPage();
				resizeTimeout = null;
			}

			var resizeTimeout = setTimeout( delayed, 200 );

			if ( resizeTimeout ) {
				clearTimeout( resizeTimeout );
			}
		}

		window.addEventListener( 'scroll', scrollHandler, false );
		window.addEventListener( 'resize', resizeHandler, false );
	}
	function _scrollPage() {

		sections.forEach( function( el, i ) {
			if( inViewport( el, options.viewportFactor ) ) {
				classie.add( el, 'cbp-so-animate' );
			}
			else {
				// this add class init if it doesn't have it. This will ensure that the items initially in the viewport will also animate on scroll
				classie.add( el, 'cbp-so-init' );
				classie.remove( el, 'cbp-so-animate' );
			}
		});
		didScroll = false;
	}

	return {
		el:el,
		init:_init
	};
}

module.exports = listViewOnScroll;