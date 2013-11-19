var name		= "Social Butterfly";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Cheerfully said Hi to 53 different players in one game day";
var status_text		= "You could've walked on by, but no: you took the time to say \"Hi\" 53 times, to 53 Glitches. Your sense of social satisfaction is enough, but have a badge anyway, you Social Butterfly, you. Or is that \"Social Butterflhi\"? No it isn't. That's just silly.";
var last_published	= 1351309723;
var is_shareworthy	= 1;
var url		= "social-butterfly";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-29\/social_butterfly_1351536165.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-29\/social_butterfly_1351536165_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-29\/social_butterfly_1351536165_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-29\/social_butterfly_1351536165_40.png";
function on_apply(pc){
	
}
var conditions = {
};
function onComplete(pc){ // generated from rewards
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_achievement_modifier();
	if (/completist/i.exec(this.name)) { 
		 var level = pc.stats_get_level(); 
		 if (level > 4) {  
				multiplier *= (pc.stats_get_level()/4); 
		} 
	} 
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(30 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 30
	}
};

//log.info("social_butterfly.js LOADED");

// generated ok (NO DATE)
