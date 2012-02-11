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
 * CLASS AnimationTimeline
 */

/* Constructor */
function AnimationTimeline(options) {
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

		this.tracks.push(new AnimationTrack(trackAnimations));
	}
}

AnimationTimeline.prototype.play = function() {
};
AnimationTimeline.prototype.stop = function() {
};
//Timeline.prototype.pause = function(){};
//Track.prototype.resume = function(){};
//Track.prototype.rewind = function(){};
//Track.prototype.goto = function(){};

/*
* CLASS Animation
*/

/* Constructor */
function Animation(options) {
	
	this.status = this.NEEDS_CSS_REFRESH;
		
	this.setElement(options.element);
	
	this.animations = [];
	for(var i=0; i<options.animations.length; i++){
		this.animations.push({});
		this.setName(i, options.animations[i].name);	
		this.setDuration(i, options.animations[i].duration);	
		this.setDelay(i, options.animations[i].delay);
		this.setCount(i, options.animations[i].count); 
		this.setFillMode(i, options.animations[i].fillMode);
		this.setDirection(i, options.animations[i].direction);
		this.setTimingFunction(i, options.animations[i].timingFunction);
	}	
	
	this.vendorPrefixes = ['webkit', 'moz', 'o', 'ms'];
	
	this.refreshCssRules();	
	
	var _this = this;	
	$(this.element).bind('webkitAnimationEnd mozAnimationEnd animationEnd', function(){});	
	
};

/* CONSTANTS */
Animation.prototype.READY = 'ready';
Animation.prototype.NEEDS_CSS_REFRESH = 'needs css refresh';


/* Control methods */
Animation.prototype.play = function() {
	
	while(this.status != this.READY){
		switch(this.status){
			case this.NEEDS_CSS_REFRESH:{
				this.refreshCssRules();
				break;
			}
		}
	}
	
	for(var rule in this.cssRules){
		console.log(this.cssRules[rule].value)
		$(this.element).css(this.cssRules[rule].key, this.cssRules[rule].value);
	}
	this.resume();	
};

Animation.prototype.stop = function() {			
	for(var rule in this.cssRules){
		$(this.element).css(this.cssRules[rule].key, '');			
	}	
};

Animation.prototype.pause = function(){
	var cssRules = this.appendVendorPrefixes({'key': 'animation-play-state','value': 'paused'});
	for(var rule in cssRules){
		$(this.element).css(cssRules[rule].key, cssRules[rule].value);
	}
};

Animation.prototype.resume = function(){
	var cssRules = this.appendVendorPrefixes({'key': 'animation-play-state','value': 'running'});
	for(var rule in cssRules){
		$(this.element).css(cssRules[rule].key, cssRules[rule].value);
	}
};

/* Setters & getters */
Animation.prototype.setElement = function(newElement) {
	if(!(this.element = newElement)) throw(new Error('Animation: an element is required'));
};
Animation.prototype.getElement = function() {
	return this.element;
};
Animation.prototype.setAnimations = function(newAnimations) {	
	this.animations = newAnimations;
	this.status = this.NEEDS_CSS_REFRESH;
};
Animation.prototype.getAnimations = function() {
	return this.animations;
};
Animation.prototype.setName = function(animationIndex, newName) {
	if(!(this.animations[animationIndex].name = newName)) throw(new Error('Animation: an animation name is required'));
	this.status = this.NEEDS_CSS_REFRESH;	
};
Animation.prototype.getName = function(animationIndex) {
	return this.animations[animationIndex].name;
};
Animation.prototype.setDuration = function(animationIndex, newDuration) {
	if(!(newDuration.match(/^[0-9]{2,}ms$|^[0-9]{2,}s$|^\[1-9]ms$|^\[1-9]s$/) ? 
		this.animations[animationIndex].duration = newDuration : 
		newDuration.match(/^[0-9]+[0-9]$|^\[1-9]$/) ? 
			this.animations[animationIndex].duration = newDuration + 'ms' : 
			false
		)
	) throw new Error('Animation: an animation duration is required');
	this.status = this.NEEDS_CSS_REFRESH;
};
Animation.prototype.getDuration = function(animationIndex) {
	return this.animations[animationIndex].duration;
};
Animation.prototype.setDelay = function(animationIndex, newDelay) {
	this.animations[animationIndex].delay = newDelay.match(/^[0-9]{2,}ms$|^[0-9]{2,}s$|^\[1-9]ms$|^\[1-9]s$/) ? 
		newDelay : 
		newDelay.match(/^[0-9]{2,}$|^\[1-9]$/) ? 
			newDelay + 'ms' : 
			'';
	this.status = this.NEEDS_CSS_REFRESH;
};
Animation.prototype.getDelay = function(animationIndex) {
	return this.animations[animationIndex].delay;
};
Animation.prototype.setCount = function(animationIndex, newCount) {
	this.animations[animationIndex].count = newCount.match(/^[0-9]{2,}$|^[2-9]$|^\s*infinite\s*$/) ? newCount : '';
	this.status = this.NEEDS_CSS_REFRESH; 
};
Animation.prototype.getCount = function(animationIndex) {
	return this.animations[animationIndex].count;
};
Animation.prototype.setFillMode = function(animationIndex, newFillMode) {
	this.animations[animationIndex].fillMode = newFillMode.match(/^\s*both\s*$|^\s*forwards\s*$|^\s*backwards\s*$/) ? newFillMode : '';
	this.status = this.NEEDS_CSS_REFRESH;
};
Animation.prototype.getFillMode = function(animationIndex) {
	return this.animations[animationIndex].fillMode;
};
Animation.prototype.setDirection = function(animationIndex, newDirection) {
	this.animations[animationIndex].direction = newDirection.match(/^\s*alternate\s*$/) ? newDirection : '';
	this.status = this.NEEDS_CSS_REFRESH;
};
Animation.prototype.getFillMode = function(animationIndex) {
	return this.animations[animationIndex].direction;
};
Animation.prototype.setTimingFunction = function(animationIndex, newTimingFunction) {
	this.animations[animationIndex].timingFunction = newTimingFunction.match(/^\s*ease\-in\s*$|^\s*ease\-out\s*$|^\s*ease\-in\-out\s*$/) ? newTimingFunction : 'linear';
	this.status = this.NEEDS_CSS_REFRESH;
};
Animation.prototype.getTimingFunction = function(animationIndex) {
	return this.animations[animationIndex].timingFunction;
};



/* CSS related methods */
Animation.prototype.refreshCssRules = function(){
	var newRules = []; 
	for(animation in this.animations){
		
		newRules.push([
			this.animations[animation].name, 
			this.animations[animation].duration, 
			this.animations[animation].delay, 
			this.animations[animation].count, 
			this.animations[animation].fillMode, 
			this.animations[animation].direction, 
			this.animations[animation].timingFunction
		].join(' '));		
	}
	// The order of the rules is IMPORTANT
	this.cssRules = this.appendVendorPrefixes({
			'key': 'animation',
			'value': newRules.join(', ')
	});	
	console.log(this.cssRules);
	this.status = this.READY;
}
Animation.prototype.appendVendorPrefixes = function(cssRule){
	var cssRules = [cssRule];
	for(var i=0; i<this.vendorPrefixes.length; i++) cssRules.push({'key': '-' + this.vendorPrefixes[i] + '-' + cssRules[0].key, 'value': cssRules[0].value});
	return cssRules;
}

