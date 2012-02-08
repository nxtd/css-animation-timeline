window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());




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
 * 	 animate: '',							==> jQuery object | CSS selector | DOM object
 * 	 name: '',								==> CSS keyframes name
 *   direction: '',							==> normal | alternate
 *   count: '1',							==> # | infinite
 *   fillMode: 'both'						==> none | both | forwards | backwards
 * 	 startAt: '',							==> keyframe | time in ms
 *   endAt: '',								==> keyframe | time in ms
 *   onStart: function(event){}				==> Called when the animation starts
 *   onKeyFrame: function(event)			==> Called when the animation reaches a keyframe
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
 * 	 fps: 30,      							==> These do not correspond to CSS keyframes (keyframes are just meaningfull frames like in Flash)
 *   animations: [{anim1},{anim2}, etc],	
 *   delay: 0,								==> The delay before the timeline starts
 *   snapToFrames: true,					==> When assigning keyframes to frames it may be needed to rewrite some CSS keyframes so that they match the frames of the timeline
 *   loop: false
 * }
 *
 * 
 * +--------------+
 * | Events fired |
 * +--------------+
 * 
 * timelineStart	==> 
 * timelineEnd		==> 
 * animationStart	==> Triggered when the animation starts. The event object will carry the animation object.
 * animationEnd		==> Triggered when the animation ends. The event object will carry the animation object.
 * 
 */
;(function($){

    $.fn.extend({

        animationTimeline: function(options) {

            this.defaultOptions = {
            	fps: 30,
 				animations: [],
 				delay: 0,
 				snapToFrames: true,
 				loop: false
 			};

            var settings = $.extend({}, this.defaultOptions, options);                    

            return this.each(function() {

                var $this = $(this);
                                
                setTimeout(function(){										//Set the initial delay if any
										
					for(var i=0;i<settings.animations.length;i++){			// Iterate through animations
						
						initializeAnimation(settings.animations[i])
						    	            	
	                }   
	                             
                },settings.delay);                
            });
            
            // Initialize the Animation objects
            function initializeAnimation(animation){
            	            	
            	animation.currentCount=0;									// Set the current animation count to 0 for animation set to repeat a certain number of times only             	
            }
            
            // Convert milliseconds to a # of frames according to the FPS defined
            function millisecondsToFrames(ms){
            
            	return Math.floor(ms * settings.fps / 1000);
            }
            
            // Convert a # of frames to milliseconds according to the FPS defined
            function framesToMilliseconds(fms){
            
            	return Math.floor(fms / settings.fps * 1000);
            }
        }
    });
})(jQuery);

