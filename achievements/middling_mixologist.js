var name		= "Middling Mixologist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Crafted 23 cocktails with a Cocktail Shaker.";
var status_text		= "Sort of takes you back to your first time adding two juices, doesn't it? Now that you have crafted 23 cocktails with a Cocktail Shaker, you are certainly, at least, a Middling Mixologist.";
var last_published	= 1316304508;
var is_shareworthy	= 0;
var url		= "middling-mixologist";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/middling_mixologist_1304983597.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/middling_mixologist_1304983597_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/middling_mixologist_1304983597_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/middling_mixologist_1304983597_40.png";
function on_apply(pc){
	
}
var conditions = {
	62 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "cocktail_shaker",
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
	pc.stats_add_favor_points("friendly", round_to_5(25 * multiplier));
	pc.making_try_learn_recipe(65);
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
		"giant"		: "friendly",
		"points"	: 25
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "65",
			"label"		: "Slow Gin Fizz",
			"id"		: 65
		}
	}
};

//log.info("middling_mixologist.js LOADED");

// generated ok (NO DATE)
