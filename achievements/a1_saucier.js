var name		= "A-1 Saucier";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Simmered 137 concoctions in a Saucepan";
var status_text		= "You've never been bland, but now: a little richer, a little tangier, and a little more likely to enjoy dribbling down someone's chin than ever before. You're an  A-1 Saucier. Saucy!";
var last_published	= 1349461033;
var is_shareworthy	= 1;
var url		= "a1-saucier";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/a1_saucier_1304983456.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/a1_saucier_1304983456_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/a1_saucier_1304983456_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/a1_saucier_1304983456_40.png";
function on_apply(pc){
	
}
var conditions = {
	41 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "saucepan",
		value	: "137"
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
	pc.stats_add_favor_points("pot", round_to_5(75 * multiplier));
	pc.making_try_learn_recipe(43);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 500,
	"favor"		: {
		"giant"		: "pot",
		"points"	: 75
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "43",
			"label"		: "Whortleberry Jelly",
			"id"		: 43
		}
	}
};

//log.info("a1_saucier.js LOADED");

// generated ok (NO DATE)
