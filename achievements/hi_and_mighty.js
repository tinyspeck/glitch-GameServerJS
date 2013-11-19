var name		= "Hi and Mighty";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Got a Mega-Hi 17 times in one game day";
var status_text		= "You roamed the world, and found 17 Glitches whose Hi Signs magically matched yours. Not only have you found 17 kindred spirits, you've also found yourself a badge. Yay!";
var last_published	= 1351302635;
var is_shareworthy	= 1;
var url		= "hi-and-mighty";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-29\/hi_and_mighty_1351536168.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-29\/hi_and_mighty_1351536168_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-29\/hi_and_mighty_1351536168_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-29\/hi_and_mighty_1351536168_40.png";
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 100
	}
};

//log.info("hi_and_mighty.js LOADED");

// generated ok (NO DATE)
