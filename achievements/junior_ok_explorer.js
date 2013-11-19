var name		= "Junior OK Explorer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited 5 new locations.";
var status_text		= "Hey! You're getting pretty good at finding your way around. You've earned a Junior OK Explorer badge.";
var last_published	= 1344839083;
var is_shareworthy	= 0;
var url		= "junior-ok-explorer";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/junior_ok_explorer_1304983174.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/junior_ok_explorer_1304983174_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/junior_ok_explorer_1304983174_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/junior_ok_explorer_1304983174_40.png";
function on_apply(pc){
	
}
var conditions = {
	3 : {
		type	: "group_count",
		group	: "locations_visited",
		value	: "5"
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
	pc.stats_add_xp(round_to_5(125 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 125,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 10
	}
};

//log.info("junior_ok_explorer.js LOADED");

// generated ok (NO DATE)
