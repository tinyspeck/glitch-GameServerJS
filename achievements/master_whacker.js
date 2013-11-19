var name		= "Master Whacker";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Minced, chopped and hacked 137 recipes with a Knife & Board.";
var status_text		= "Nobody wields a blade like you. You're a knife and board-certified Master Whacker!";
var last_published	= 1348801861;
var is_shareworthy	= 1;
var url		= "master-whacker";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_whacker_1304983374.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_whacker_1304983374_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_whacker_1304983374_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_whacker_1304983374_40.png";
function on_apply(pc){
	
}
var conditions = {
	23 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "knife_and_board",
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
	pc.making_try_learn_recipe(16);
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
			"recipe_id"	: "16",
			"label"		: "Big Salad",
			"id"		: 16
		}
	}
};

//log.info("master_whacker.js LOADED");

// generated ok (NO DATE)
