var name		= "4-Star Cuisinartist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Whipped up 79 meals with an Awesome Pot";
var status_text		= "Kiss my grits! You've just been promoted to 4-Star Cuisinartist.";
var last_published	= 1316304379;
var is_shareworthy	= 0;
var url		= "4star-cuisinartist";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/4star_cuisinartist_1304983478.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/4star_cuisinartist_1304983478_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/4star_cuisinartist_1304983478_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/4star_cuisinartist_1304983478_40.png";
function on_apply(pc){
	
}
var conditions = {
	47 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "awesome_pot",
		value	: "79"
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
	pc.stats_add_xp(round_to_5(350 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(45 * multiplier));
	pc.making_try_learn_recipe(32);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 350,
	"favor"		: {
		"giant"		: "pot",
		"points"	: 45
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "32",
			"label"		: "Ix-style Braised Meat",
			"id"		: 32
		}
	}
};

//log.info("4star_cuisinartist.js LOADED");

// generated ok (NO DATE)
