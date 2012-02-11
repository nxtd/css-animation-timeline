$(document).ready(function(){
	
	var cssKeyframesRules = getCssKeyframesRules();
	if(cssKeyframesRules!=null){
		for(var rule in cssKeyframesRules){		
			$('#animation-demo .animation-name select').append($('<option>'+ cssKeyframesRules[rule].name +'</option>'));
		}
	}
	else{
		$('#animation-demo .animation-name select').append($('<option>rotate-CW-360</option>'));
	}
	
	var toy1 = null;
	$('#animation-demo form .play-animation').click(function(){		
		
		toy1 = new Animation({
			element: $('#animation-demo .toy')[0],
			name: $('#animation-demo form .animation-name select').val(),
			duration: $('#animation-demo form .animation-duration input').val() + 'ms',
			delay: $('#animation-demo form .animation-delay input').val() + 'ms',
			count: $('#animation-demo form .animation-count input').val(),
			direction: $('#animation-demo form .animation-direction select').val(),
			fillMode: $('#animation-demo form .animation-fill-mode select').val(),
			timingFunction: $('#animation-demo form .animation-timing-function select').val()
		});
		
		toy1.play();
		
		return false;
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



