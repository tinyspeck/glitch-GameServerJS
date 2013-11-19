var name		= "Fine Mincer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Minced, chopped and hacked 23 recipes with a Knife & Board.";
var status_text		= "Chop chop! For your deftitude with a knife and board, you've earned a Fine Mincer badge.";
var last_published	= 1316304974;
var is_shareworthy	= 0;
var url		= "fine-mincer";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fine_mincer_1304983359.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fine_mincer_1304983359_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fine_mincer_1304983359_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fine_mincer_1304983359_40.png";
function on_apply(pc){
	
}
var conditions = {
	20 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "knife_and_board",
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(20 * multiplier));
	pc.making_try_learn_recipe(100);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 150,
	"favor"		: {
		"giant"		: "pot",
		"points"	: 20
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "100",
			"label"		: "Snack Pack",
			"id"		: 100
		}
	}
};

//log.info("fine_mincer.js LOADED");

// generated ok (NO DATE)
