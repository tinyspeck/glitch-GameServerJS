var name		= "Broil King";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Delicately charred 137 dishes with a Famous Pugilist Grill.";
var status_text		= "Kiss the cook? Don't mind if we do! You are hereby awarded the title of Broil King.";
var last_published	= 1348796826;
var is_shareworthy	= 1;
var url		= "broil-king";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/broil_king_1304983431.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/broil_king_1304983431_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/broil_king_1304983431_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/broil_king_1304983431_40.png";
function on_apply(pc){
	
}
var conditions = {
	36 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "mike_tyson_grill",
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
	pc.making_try_learn_recipe(29);
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
			"recipe_id"	: "29",
			"label"		: "Expensive Grilled Cheese",
			"id"		: 29
		}
	}
};

//log.info("broil_king.js LOADED");

// generated ok (NO DATE)
