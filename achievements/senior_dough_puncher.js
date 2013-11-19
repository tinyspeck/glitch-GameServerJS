var name		= "Senior Dough Puncher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Prepared 67 unique recipes.";
var status_text		= "You've got a nose for nosing out recipes. You're hereby promoted to Senior Dough Puncher status.";
var last_published	= 1348802529;
var is_shareworthy	= 1;
var url		= "senior-dough-puncher";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/senior_dough_puncher_1315979179.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/senior_dough_puncher_1315979179_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/senior_dough_puncher_1315979179_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/senior_dough_puncher_1315979179_40.png";
function on_apply(pc){
	
}
var conditions = {
	15 : {
		type	: "group_count",
		group	: "making_food",
		value	: "67"
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 50
	}
};

//log.info("senior_dough_puncher.js LOADED");

// generated ok (NO DATE)
