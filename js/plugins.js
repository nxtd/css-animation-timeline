window.log = function f() {
	log.history = log.history || [];
	log.history.push(arguments);
	if(this.console) {
		var args = arguments, newarr;
		args.callee = args.callee.caller;
		newarr = [].slice.call(args);
		if( typeof console.log === 'object')
			log.apply.call(console.log, console, newarr);
		else
			console.log.apply(console, newarr);
	}
};
(function(a) {
	function b() {
	}

	for(var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), d; !!( d = c.pop()); ) {
		a[d] = a[d] || b;
	}
})( function() {
	try {
		console.log();
		return window.console;
	} catch(a) {
		return (window.console = {});
	}
}());

////////////////////// ANIMATION TIMELINE ////////////////////////////////////////////////////////////////////////////////
/*
* The Animation Timeline consumes Animation objects objects.
*
*
* +----------------------------+
* | Animation object structure |
* +----------------------------+
*
* {
* 	animate: '',							==> jQuery object | CSS selector | DOM object
* 	name: '',								==> CSS keyframes name
*   direction: '',							==> normal | alternate
*   count: '1',								==> # | infinite
*   fillMode: 'both'						==> none | both | forwards | backwards
* 	startAt: null,							==> keyframe (e.g. '35frm', '0frm') | time in s or ms (e.g '500ms', '2s', etc) | # of milliseconds (e.g. 2300, 400, etc)
*   endAt: null,							==> keyframe | time in s or ms | # of milliseconds
*   onStart: function(event){}				==> Called when the animation starts
*   onKeyFrame: function(event)				==> Called when the animation reaches a keyframe
*   onEnd: function(event){}				==> Called when the animation ends
* }
*
* It is based on a system of frames per second (FPS).
*
*
* +---------+
* | Options |
* +---------+
*
* {
* 	fps: 30,      							==> These do not correspond to CSS keyframes (keyframes are just meaningfull frames like in Flash)
*   animations: [{anim1},{anim2}, etc],
*   delay: 0,								==> The delay before the timeline starts
*   snapToFrames: true,						==> When assigning keyframes to frames it may be needed to rewrite some CSS keyframes so that they match the frames of the timeline
*   loop: false
* }
*
*
* +--------------+
* | Events fired |
* +--------------+
*
* timelineStart		==> Guess what?
* timelineEnd		==> Guess what?
* animationStart	==> Triggered when the animation starts. The event object will carry the animation object.
* animationEnd		==> Triggered when the animation ends. The event object will carry the animation object.
*
* Notes 
* - A DOM|Jquery object can run several animations at once in parallel (but you will need to create several 
* 	Animation objects)
* - when writing your css animations, use your prefered vendor prefix, the plugin will 
*   automatically prepend the missing '-webkit-', '-moz-', '-o-' and '-ms-' and add the corresponding rules to the css 
*   (even if the CSS properties are not yet supported by the vendors - e.g. animation with '-o-' or '-ms-').
*  
*
*/
;(function($) {

	$.fn.extend({

		animationTimeline : function(options) {

			this.defaultOptions = {
				fps : 30,
				animations : [],
				delay : 0,
				snapToFrames : true,
				loop : false
			};

			var settings = $.extend({}, this.defaultOptions, options);

			return this.each(function() {

				var $this = $(this);

				setTimeout(function() {										//Set the initial delay if any

					for(var i = 0; i < settings.animations.length; i++) {	// Iterate through animations												
						
						initializeAnimation(settings.animations[i])

					}

				}, settings.delay);
			});
						
			function initializeAnimation(animation) {									// Initialize the Animation objects
				
				animation.animate = (!animation.animate.jquery) ? $(animation.animate);	// Convert the DOM element to a jQuery object if it is not yet one (then it is either a DOM object or a CSS selector)

				animation.currentCount = 0;												// Set the current animation count to 0 for animation set to repeat a certain number of times only
				
			}
			startAnimation

			function millisecondsToFrames(ms) {								// Convert milliseconds to a # of frames according to the FPS defined

				return Math.floor(ms * settings.fps / 1000);
			};

			function framesToMilliseconds(fms) {							// Convert a # of frames to milliseconds according to the FPS defined

				return Math.floor(fms / settings.fps * 1000);
			};

		}
	});
})(jQuery);
