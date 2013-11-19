var name		= "Dedicated Meataterian";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Nibbled 23 meats";
var status_text		= "You sure do enjoy your vittles. You've earned the title Dedicated Meataterian!";
var last_published	= 1338926857;
var is_shareworthy	= 0;
var url		= "dedicated-meataterian";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/dedicated_meataterian_1304983497.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/dedicated_meataterian_1304983497_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/dedicated_meataterian_1304983497_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/dedicated_meataterian_1304983497_40.png";
function on_apply(pc){
	
}
var conditions = {
	49 : {
		type	: "counter",
		group	: "items_eaten",
		label	: "meat",
		value	: "23"
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

//log.info("dedicated_meataterian.js LOADED");

// generated ok (NO DATE)
