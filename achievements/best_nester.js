var name		= "Best Nester";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Incubated 17 Eggs, with some help from a Chicken";
var status_text		= "If there's anything nobler than bringing new life into the world, it's bringing 17 new lives into the world. For incubating so many Eggs, you've earned this Best Nester award.";
var last_published	= 1348796778;
var is_shareworthy	= 1;
var url		= "best-nester";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/best_nester_1304984159.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/best_nester_1304984159_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/best_nester_1304984159_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/best_nester_1304984159_40.png";
function on_apply(pc){
	
}
var conditions = {
	244 : {
		type	: "group_sum",
		group	: "eggs_incubated",
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
	pc.stats_add_favor_points("humbaba", round_to_5(25 * multiplier));
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
		"giant"		: "humbaba",
		"points"	: 25
	}
};

//log.info("best_nester.js LOADED");

// generated ok (NO DATE)
