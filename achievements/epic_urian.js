var name		= "Epic Urian";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Pitched in to each feat in 7 epics";
var status_text		= "In ancient times, the completion of ones seventh epic of feats is celebrated by an epic feast. In modern Ur, the heaving tables of food are replaced by this Epic Urian badge. Do not eat it.";
var last_published	= 1351302446;
var is_shareworthy	= 1;
var url		= "epic-urian";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/epic_urian_1351300696.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/epic_urian_1351300696_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/epic_urian_1351300696_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/epic_urian_1351300696_40.png";
function on_apply(pc){
	
}
var conditions = {
	847 : {
		type	: "group_count",
		group	: "epics_completed",
		value	: "7"
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(67 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "all",
		"points"	: 67
	}
};

//log.info("epic_urian.js LOADED");

// generated ok (NO DATE)
