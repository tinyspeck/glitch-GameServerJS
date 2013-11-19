var name		= "Pretty Good Samaritan";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gave 29 gifts to other players";
var status_text		= "Just give 'er! Your good samaritizing has just earned you a Pretty Good Samaritan badge.";
var last_published	= 1338927100;
var is_shareworthy	= 0;
var url		= "pretty-good-samaritan";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_good_samaritan_1304984036.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_good_samaritan_1304984036_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_good_samaritan_1304984036_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_good_samaritan_1304984036_40.png";
function on_apply(pc){
	
}
var conditions = {
	222 : {
		type	: "group_sum",
		group	: "items_given",
		value	: "29"
	},
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
	pc.stats_add_favor_points("friendly", round_to_5(15 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 15
	}
};

//log.info("pretty_good_samaritan.js LOADED");

// generated ok (NO DATE)
