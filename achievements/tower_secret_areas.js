var name		= "11 Secrets of the Jethimadh Tower Base";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "Found all 11 spots in the Jethimadh Tower Base.";
var status_text		= "You sneaky little bugger! You found every last one of the 11 secret spots in the Jethimadh Tower Base? Good job! But, please keep the secrets safe …";
var last_published	= 1348802954;
var is_shareworthy	= 1;
var url		= "11-secrets-of-jethimadh-tower-base";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/tower_secret_areas_1304998959.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/tower_secret_areas_1304998959_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/tower_secret_areas_1304998959_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/tower_secret_areas_1304998959_40.png";
function on_apply(pc){
	
}
var conditions = {
	431 : {
		type	: "group_count",
		group	: "tower_secrets",
		value	: "11"
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
	pc.metabolics_add_mood(round_to_5(30 * multiplier));
	pc.stats_add_favor_points("lem", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"mood"	: 30,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 50
	}
};

//log.info("tower_secret_areas.js LOADED");

// generated ok (NO DATE)
