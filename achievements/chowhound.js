var name		= "Chowhound";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Prepared 17 unique recipes.";
var status_text		= "Yummo! You've figured out a lot of recipes. You've earned a Chowhound badge.";
var last_published	= 1323914082;
var is_shareworthy	= 0;
var url		= "chowhound";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/chowhound_1315979176.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/chowhound_1315979176_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/chowhound_1315979176_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/chowhound_1315979176_40.png";
function on_apply(pc){
	
}
var conditions = {
	13 : {
		type	: "group_count",
		group	: "making_food",
		value	: "17"
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 25
	}
};

//log.info("chowhound.js LOADED");

// generated ok (NO DATE)
