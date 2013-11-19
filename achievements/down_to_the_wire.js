var name		= "Down To The Wire";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Be one of the few Glitches to tip the scales. Make a contribution in the last 30 minutes of the feat, and with 5% or less left to contribute towards whichever goal is coming up next.";
var status_text		= "In the dying moments of the feat, you made your mark. They couldn't have done it without you - well, maybe they could, but they didn't. Have a badge!";
var last_published	= 1352512171;
var is_shareworthy	= 1;
var url		= "down-to-the-wire";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/down_to_the_wire_1351301840.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/down_to_the_wire_1351301840_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/down_to_the_wire_1351301840_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/down_to_the_wire_1351301840_40.png";
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(19 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "all",
		"points"	: 19
	}
};

//log.info("down_to_the_wire.js LOADED");

// generated ok (NO DATE)
