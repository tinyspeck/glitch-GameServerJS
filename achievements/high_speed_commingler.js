var name		= "High Speed Commingler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Blended 23 drinks or sno cones with a Blender.";
var status_text		= "Whirrrrrrrrrrr ... fresh juice, appealing beverages, that mechanical wizard of mixing is coming under your spell. For blending 23 drinks you have earned the High Speed Commingler badge.";
var last_published	= 1351724328;
var is_shareworthy	= 0;
var url		= "high-speed-commingler";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/high_speed_commingler_1304983613.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/high_speed_commingler_1304983613_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/high_speed_commingler_1304983613_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/high_speed_commingler_1304983613_40.png";
function on_apply(pc){
	
}
var conditions = {
	59 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "blender",
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
	pc.making_try_learn_recipe(57);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 200,
	"favor"		: {
		"giant"		: "pot",
		"points"	: 25
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "57",
			"label"		: "Exotic Juice",
			"id"		: 57
		}
	}
};

//log.info("high_speed_commingler.js LOADED");

// generated ok (NO DATE)
