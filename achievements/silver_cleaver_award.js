var name		= "Silver Cleaver Award";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Minced, chopped and hacked 79 recipes with a Knife & Board.";
var status_text		= "You've really honed your chopping abilities. You win the Silver Cleaver Award!";
var last_published	= 1348802567;
var is_shareworthy	= 1;
var url		= "silver-cleaver-award";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/silver_cleaver_award_1304983369.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/silver_cleaver_award_1304983369_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/silver_cleaver_award_1304983369_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/silver_cleaver_award_1304983369_40.png";
function on_apply(pc){
	
}
var conditions = {
	22 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "knife_and_board",
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
	pc.making_try_learn_recipe(9);
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
			"recipe_id"	: "9",
			"label"		: "Choice Crudites",
			"id"		: 9
		}
	}
};

//log.info("silver_cleaver_award.js LOADED");

// generated ok (NO DATE)
