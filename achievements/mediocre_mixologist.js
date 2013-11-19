var name		= "Mediocre Mixologist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Crafted 11 cocktails with a Cocktail Shaker.";
var status_text		= "Having crafted 11 cocktails with a Cocktail Shaker, you are now able to pass yourself off as a Mediocre Mixologist. Good job.";
var last_published	= 1316304503;
var is_shareworthy	= 0;
var url		= "mediocre-mixologist";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/mediocre_mixologist_1304983603.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/mediocre_mixologist_1304983603_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/mediocre_mixologist_1304983603_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/mediocre_mixologist_1304983603_40.png";
function on_apply(pc){
	
}
var conditions = {
	61 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "cocktail_shaker",
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(15 * multiplier));
	pc.making_try_learn_recipe(67);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 100,
	"favor"		: {
		"giant"		: "friendly",
		"points"	: 15
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "67",
			"label"		: "Cloudberry Daiquiri",
			"id"		: 67
		}
	}
};

//log.info("mediocre_mixologist.js LOADED");

// generated ok (NO DATE)
