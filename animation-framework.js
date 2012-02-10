/*
Copyright (c) 2012 Nicolas Dancie, http://about.me/nicolasdancie

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

////////////////////// ANIMATION TIMELINE ////////////////////////////////////////////////////////////////////////////////
/*
* The Animation Timeline consumes Animation objects objects.
*
*
* +----------------------------+
* | Animation object structure |
* +----------------------------+
*
* These are native javascript objects.
*
* {
* 	element: null,							==> a DOM element
* 	keyframesName: '',						==> CSS keyframes name
*   direction: '',							==> normal | alternate
*   count: '1',								==> # | infinite
*   fillMode: 'both'						==> none | both | forwards | backwards
* 	startAt: null,							==> keyframe (e.g. '35frm', '0frm') | time in s or ms (e.g '500ms', '2s', etc) | # of milliseconds (e.g. 2300, 400, etc)
*   endAt: null,							==> keyframe | time in s or ms | # of milliseconds
*   onStart: function(event){}				==> Called when the animation starts
*   onKeyFrame: function(event)				==> Called when the animation reaches a keyframe
*   onEnd: function(event){}				==> Called when the animation ends
* 	setters & getters
* }
*
* NOTE THAT THE DELAY PROPERTY IS NOT SUPPORTED as it can be computed and passed via the startAt property
*
* These animation are embedded in a Track object which join together all animations occuring to an element
*
* {
* 	element: DOM Element
*   animations: [
* 		animation,
* 		animation,
* 		...
* 	]
* }
*
* +------------------------+
* | Track object structure |
* +------------------------+
*
* {
* 	animate: '',							==> jQuery object | CSS selector | DOM object
* 	animations: [
* 		{animation1},
* 		{animation2},
* 		{...}
* 	]
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
*   tracks: [{track1},{track2}, etc],
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

/*
* ANIMATION CLASS
*/

/* Constructor */
function Animation(options) {
	this.animatedElement = options.animatedElement || null;
	this.keyframesName = options.keyframesName || null;
	this.startAt = options.startAt || 0;
	this.endAt = options.endAt || 0;
	this.count = options.count || 1;
	this.fillMode = options.fillMode || 'both';
	this.direction = options.direction || 'normal';
};

/* Setters & getters */
Animation.prototype.setAnimatedElement = function(newElement) {
	this.element = newElement;
};
Animation.prototype.getAnimatedElement = function() {
	return this.element;
};
Animation.prototype.setKeyframesName = function(newKeyframesName) {
	this.keyframesName = newKeyframesName;
};
Animation.prototype.getKeyframesName = function() {
	return this.keyframesName;
};
Animation.prototype.setStartAt = function(newTime) {
	this.startAt = newTime;
};
Animation.prototype.getStartAt = function() {
	return this.startAt;
};
Animation.prototype.setEndAt = function(newTime) {
	this.endAt = newTime;
};
Animation.prototype.getEndAt = function() {
	return this.endAt;
};
Animation.prototype.setCount = function(newCount) {
	this.count = newCount;
};
Animation.prototype.getCount = function() {
	return this.count;
};
Animation.prototype.setFillMode = function(newFillMode) {
	this.fillMode = newFillMode;
};
Animation.prototype.getFillMode = function() {
	return this.fillMode;
};
Animation.prototype.setDirection = function(newDirection) {
	this.direction = newDirection;
};
Animation.prototype.getFillMode = function() {
	return this.direction;
};
/* Control methods */
Animation.prototype.start = function() {
	return this;
};
/* Chaining methods */
Animation.prototype.onStart = function(callback) {
	callback();
	return this;
};
Animation.prototype.onKeyframe = function(callback) {
	callback();
	return this;
};
Animation.prototype.onEnd = function(callback) {
	callback();
	return this;
};


/*
 * TRACK CLASS
 * 
 * A track is a series of Animations that apply to one DOM element
 */
function Track(animations) {// Animations need to be on the same DOM element
	var a = (animations.length) ? animations : [animations];

	/*
	 * Reprocess Animations to group them.
	 * If 2 or more animations are overlapping, then they need
	 * to be passed together as CSS rules.
	 *
	 * The process will also re-write the cssRule properties of these Animation.
	 */

};

Track.prototype.play = function() {
};
Track.prototype.stop = function() {
};
//Track.prototype.pause = function(){};
//Track.prototype.resume = function(){};
//Track.prototype.rewind = function(){};
//Track.prototype.goto = function(){};

/*
 * TIMELINE CLASS
 */

/* Constructor */
function Timeline(options) {
	this.fps = 30;
	this.animations = [];
	this.delay = 0;
	this.loop = false;
	//this.snapToFrames = true;

	this.tracks = [];

	/*
	 * Scan Animations to check if some of them apply to the same Element.
	 * If so the Animations are grouped.
	 * Then Timeline Tracks are created (with one or more Animation)
	 */
	var tempAnimations = this.animations;
	while(tempAnimations.length > 0) {

		var trackAnimations = [tempAnimations.splice(0, 1)];

		for(var i = 0; i < tempAnimations.length; i++) {
			if(trackAnimations[0].element === tempAnimations[i].element) {
				trackAnimations.push(tempAnimations.splice(i--, 1));
			}
		}

		this.tracks.push(new Track(trackAnimations));
	}
}

Timeline.prototype.play = function() {
};
Timeline.prototype.stop = function() {
};
//Timeline.prototype.pause = function(){};
//Track.prototype.resume = function(){};
//Track.prototype.rewind = function(){};
//Track.prototype.goto = function(){};

/*
 * Animation Class jQuery wrapper
 */

;(function($) {
	$.fn.extend({
		animation : function(options) {
			this.defaultOptions = {
			};

			var settings = $.extend({}, this.defaultOptions, options);

			return this.each(function() {

				var $this = $(this);

			});
		}
	});
})(jQuery);

/*
 * Timeline jQuery wrapper
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

				setTimeout(function() {//Set the initial delay if any

					for(var i = 0; i < settings.animations.length; i++) {	// Iterate through animations

						// Scan all animations to check if some apply to the same object in parallel

					}

				}, settings.delay);
			});
			function millisecondsToFrames(ms) {// Convert milliseconds to a # of frames according to the FPS defined

				return Math.floor(ms * settings.fps / 1000);
			};

			function framesToMilliseconds(fms) {// Convert a # of frames to milliseconds according to the FPS defined

				return Math.floor(fms / settings.fps * 1000);
			};

		}
	});
})(jQuery);