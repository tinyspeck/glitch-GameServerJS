var name		= "Superior Mixologist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Crafted 41 cocktails with a Cocktail Shaker.";
var status_text		= "The ratios, the timing, the pure finesse: not everyone appreciates the finer points of crafting a fine cocktail. But you, having crafted a whole 41 of them surely do. Congrats, Superior Mixologist.";
var last_published	= 1348802894;
var is_shareworthy	= 1;
var url		= "superior-mixologist";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/superior_mixologist_1304983591.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/superior_mixologist_1304983591_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/superior_mixologist_1304983591_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/superior_mixologist_1304983591_40.png";
function on_apply(pc){
	
}
var conditions = {
	63 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "cocktail_shaker",
		value	: "41"
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(40 * multiplier));
	pc.making_try_learn_recipe(70);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 300,
	"favor"		: {
		"giant"		: "friendly",
		"points"	: 40
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "70",
			"label"		: "Gurly Drink",
			"id"		: 70
		}
	}
};

//log.info("superior_mixologist.js LOADED");

// generated ok (NO DATE)
