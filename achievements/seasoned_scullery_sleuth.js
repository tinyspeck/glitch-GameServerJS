var name		= "Seasoned Scullery Sleuth";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Prepared 101 unique recipes.";
var status_text		= "Eureka! The kitchen holds few secrets from you. You've earned the title Seasoned Scullery Sleuth.";
var last_published	= 1348802512;
var is_shareworthy	= 1;
var url		= "seasoned-scullery-sleuth";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/seasoned_scullery_sleuth_1315979181.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/seasoned_scullery_sleuth_1315979181_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/seasoned_scullery_sleuth_1315979181_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/seasoned_scullery_sleuth_1315979181_40.png";
function on_apply(pc){
	
}
var conditions = {
	16 : {
		type	: "group_count",
		group	: "making_food",
		value	: "101"
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(75 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 75
	}
};

//log.info("seasoned_scullery_sleuth.js LOADED");

// generated ok (NO DATE)
