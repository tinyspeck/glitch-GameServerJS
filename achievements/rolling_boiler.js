var name		= "Rolling Boiler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Simmered 11 concoctions in a Saucepan";
var status_text		= "You're getting pretty handy with a Saucepan! You've earned a Rolling Boiler badge.";
var last_published	= 1338919122;
var is_shareworthy	= 0;
var url		= "rolling-boiler";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/rolling_boiler_1304983436.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/rolling_boiler_1304983436_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/rolling_boiler_1304983436_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/rolling_boiler_1304983436_40.png";
function on_apply(pc){
	
}
var conditions = {
	37 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "saucepan",
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
	pc.stats_add_xp(round_to_5(75 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(10 * multiplier));
	pc.making_try_learn_recipe(51);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 75,
	"favor"		: {
		"giant"		: "pot",
		"points"	: 10
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "51",
			"label"		: "Secret Sauce",
			"id"		: 51
		}
	}
};

//log.info("rolling_boiler.js LOADED");

// generated ok (NO DATE)
