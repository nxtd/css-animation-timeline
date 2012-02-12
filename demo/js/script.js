$(document).ready(function(){
	
	var cssKeyframesRules = getCssKeyframesRules();
	if(cssKeyframesRules!=null){
		for(var rule in cssKeyframesRules){		
			$('#animation-demo .animation-name select').append($('<option>'+ cssKeyframesRules[rule].name +'</option>'));
			$('#multiple-animations-demo .animation-name select').append($('<option>'+ cssKeyframesRules[rule].name +'</option>'));
			$('#animation-timeline-demo .animation-name select').append($('<option>'+ cssKeyframesRules[rule].name +'</option>'));			
		}
	}
	else{
		$('#animation-demo .animation-name select').append($('<option>rotate-CW-360</option>'));
	}
	
	var toy1 = null;
	$('#animation-demo form .play-animation').click(function(){		
		
		if(!toy1){
			toy1 = new Animation({
				element: $('#animation-demo .toy')[0],
				animations:[
					{
						name: $('#animation-demo form .animation-name select').val(),
						duration: $('#animation-demo form .animation-duration input').val() + 'ms',
						delay: $('#animation-demo form .animation-delay input').val(),
						count: $('#animation-demo form .animation-count input').val(),
						direction: $('#animation-demo form .animation-direction select').val(),
						fillMode: $('#animation-demo form .animation-fill-mode select').val(),
						timingFunction: $('#animation-demo form .animation-timing-function select').val()
					}
				]				
			});
		}
		else{
			toy1.setName(0, $('#animation-demo form .animation-name select').val());
			toy1.setDuration(0, $('#animation-demo form .animation-duration input').val() + 'ms');	
			toy1.setDelay(0, $('#animation-demo form .animation-delay input').val());
			toy1.setCount(0, $('#animation-demo form .animation-count input').val()); 
			toy1.setFillMode(0, $('#animation-demo form .animation-fill-mode select').val());
			toy1.setDirection(0, $('#animation-demo form .animation-direction select').val());
			toy1.setTimingFunction(0, $('#animation-demo form .animation-timing-function select').val());
		}
		
		toy1.play();
		
	});
	$('#animation-demo form .stop-animation').click(function(){
		toy1.stop();
	});
	$('#animation-demo form .pause-animation').click(function(){
		toy1.pause();
	});
	$('#animation-demo form .resume-animation').click(function(){
		toy1.resume();
	});
	
	
	// MULTIPLE ANIMATIONS
	var toy2 = null;
	$('#multiple-animations-demo .play-animation').click(function(){
		if(!toy2){
			toy2 = new Animation({
				element: $('#multiple-animations-demo .toy')[0],
				animations:[
					{
						name: $('#multiple-animations-demo .animation-1 .animation-name select').val(),
						duration: $('#multiple-animations-demo .animation-1 .animation-duration input').val() + 'ms',
						delay: $('#multiple-animations-demo .animation-1 .animation-delay input').val(),
						count: $('#multiple-animations-demo .animation-1 .animation-count input').val(),
						direction: $('#multiple-animations-demo .animation-1 .animation-direction select').val(),
						fillMode: $('#multiple-animations-demo .animation-1 .animation-fill-mode select').val(),
						timingFunction: $('#multiple-animations-demo .animation-1 .animation-timing-function select').val()
					},
					{
						name: $('#multiple-animations-demo .animation-2 .animation-name select').val(),
						duration: $('#multiple-animations-demo .animation-2 .animation-duration input').val() + 'ms',
						delay: $('#multiple-animations-demo .animation-2 .animation-delay input').val(),
						count: $('#multiple-animations-demo .animation-2 .animation-count input').val(),
						direction: $('#multiple-animations-demo .animation-2 .animation-direction select').val(),
						fillMode: $('#multiple-animations-demo .animation-2 .animation-fill-mode select').val(),
						timingFunction: $('#multiple-animations-demo .animation-2 .animation-timing-function select').val()
					}
				]				
			});
		}
		else{
			toy2.setName(0, $('#multiple-animations-demo .animation-1 .animation-name select').val());
			toy2.setDuration(0, $('#multiple-animations-demo .animation-1 .animation-duration input').val() + 'ms');	
			toy2.setDelay(0, $('#multiple-animations-demo .animation-1 .animation-delay input').val());
			toy2.setCount(0, $('#multiple-animations-demo .animation-1 .animation-count input').val()); 
			toy2.setFillMode(0, $('#multiple-animations-demo .animation-1 .animation-fill-mode select').val());
			toy2.setDirection(0, $('#multiple-animations-demo .animation-1 .animation-direction select').val());
			toy2.setTimingFunction(0, $('#multiple-animations-demo .animation-1 .animation-timing-function select').val());
			toy2.setName(1, $('#multiple-animations-demo .animation-2 .animation-name select').val());
			toy2.setDuration(1, $('#multiple-animations-demo .animation-2 .animation-duration input').val() + 'ms');	
			toy2.setDelay(1, $('#multiple-animations-demo .animation-2 .animation-delay input').val());
			toy2.setCount(1, $('#multiple-animations-demo .animation-2 .animation-count input').val()); 
			toy2.setFillMode(1, $('#multiple-animations-demo .animation-2 .animation-fill-mode select').val());
			toy2.setDirection(1, $('#multiple-animations-demo .animation-2 .animation-direction select').val());
			toy2.setTimingFunction(1, $('#multiple-animations-demo .animation-2 .animation-timing-function select').val());
		}
		
		toy2.play();
	});
	$('#multiple-animations-demo .stop-animation').click(function(){
		toy2.stop();
	});
	$('#multiple-animations-demo .pause-animation').click(function(){
		toy2.pause();
	});
	$('#multiple-animations-demo .resume-animation').click(function(){
		toy2.resume();
	});
	
	
	// ANIMATION TIMELINE
	var at = null;
	$('#animation-timeline-demo .play-animation').click(function(){
		if(!at){
			at = new AnimationTimeline({
				animations: [
					new Animation({
						element: $('#animation-timeline-demo .toy:nth-of-type(1)')[0],
						animations:[
							{
								name: $('#animation-timeline-demo .animation-1 .animation-name select').val(),
								duration: $('#animation-timeline-demo .animation-1 .animation-duration input').val() + 'ms',
								delay: $('#animation-timeline-demo .animation-1 .animation-delay input').val(),
								count: $('#animation-timeline-demo .animation-1 .animation-count input').val(),
								direction: $('#animation-timeline-demo .animation-1 .animation-direction select').val(),
								fillMode: $('#animation-timeline-demo .animation-1 .animation-fill-mode select').val(),
								timingFunction: $('#animation-timeline-demo .animation-1 .animation-timing-function select').val()
							}
						]				
					}),
					new Animation({
						element: $('#animation-timeline-demo .toy:nth-of-type(2)')[0],
						animations:[					
							{
								name: $('#animation-timeline-demo .animation-2 .animation-name select').val(),
								duration: $('#animation-timeline-demo .animation-2 .animation-duration input').val() + 'ms',
								delay: $('#animation-timeline-demo .animation-2 .animation-delay input').val(),
								count: $('#animation-timeline-demo .animation-2 .animation-count input').val(),
								direction: $('#animation-timeline-demo .animation-2 .animation-direction select').val(),
								fillMode: $('#animation-timeline-demo .animation-2 .animation-fill-mode select').val(),
								timingFunction: $('#animation-timeline-demo .animation-2 .animation-timing-function select').val()
							}
						]				
					}),
					new Animation({
						element: $('#animation-timeline-demo .toy:nth-of-type(3)')[0],
						animations:[					
							{
								name: $('#animation-timeline-demo .animation-3 .animation-name select').val(),
								duration: $('#animation-timeline-demo .animation-3 .animation-duration input').val() + 'ms',
								delay: $('#animation-timeline-demo .animation-3 .animation-delay input').val(),
								count: $('#animation-timeline-demo .animation-3 .animation-count input').val(),
								direction: $('#animation-timeline-demo .animation-3 .animation-direction select').val(),
								fillMode: $('#animation-timeline-demo .animation-3 .animation-fill-mode select').val(),
								timingFunction: $('#animation-timeline-demo .animation-3 .animation-timing-function select').val()
							}
						]				
					})
				],
				delay: 0
			});
		}		
		
		at.play();
	});
	$('#animation-timeline-demo .stop-animation').click(function(){
		at.stop();
	});
	$('#animation-timeline-demo .pause-animation').click(function(){
		at.pause();
	});
	$('#animation-timeline-demo .resume-animation').click(function(){
		at.resume();
	});
});


function getCssKeyframesRules(){
	
	var ss = document.styleSheets;
	var kfrs = [];
	for (var i = ss.length - 1; i >= 0; i--) {
		try {
			var s = ss[i],
				rs = s.cssRules ? s.cssRules : 
					 s.rules ? s.rules : 
					 [];
			
			for (var j = rs.length - 1; j >= 0; j--) {
				if (rs[j].type === window.CSSRule.WEBKIT_KEYFRAMES_RULE || rs[j].type === window.CSSRule.MOZ_KEYFRAMES_RULE){
					kfrs.push(rs[j]);
				}
			}			
		}
		catch(e) { /* Trying to interrogate a stylesheet from another domain will throw a security error */ }		
	}
	if(kfrs.length > 0) return kfrs;
	else return null;
}

function findCssKeyframesRules(a){
	
	var ss = document.styleSheets;
	for (var i = ss.length - 1; i >= 0; i--) {
		try {
			var s = ss[i],
				rs = s.cssRules ? s.cssRules : 
					 s.rules ? s.rules : 
					 [];

			for (var j = rs.length - 1; j >= 0; j--) {
				if ((rs[j].type === window.CSSRule.WEBKIT_KEYFRAMES_RULE || rs[j].type === window.CSSRule.MOZ_KEYFRAMES_RULE) && rs[j].name == a){
					return rs[j];
				}
			}
		}
		catch(e) { /* Trying to interrogate a stylesheet from another domain will throw a security error */ }
	}
	return null;
}



