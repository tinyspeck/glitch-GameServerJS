var name		= "Master Carbonifier";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Delicately charred 41 dishes with a Famous Pugilist Grill.";
var status_text		= "Delicately charred on the outside, raw in the middle. That deserves a Master Carbonifier badge!";
var last_published	= 1317768566;
var is_shareworthy	= 0;
var url		= "master-carbonifier";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_carbonifier_1304983421.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_carbonifier_1304983421_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_carbonifier_1304983421_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_carbonifier_1304983421_40.png";
function on_apply(pc){
	
}
var conditions = {
	34 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "mike_tyson_grill",
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(30 * multiplier));
	pc.making_try_learn_recipe(34);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 250,
	"favor"		: {
		"giant"		: "pot",
		"points"	: 30
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "34",
			"label"		: "Abbasid Ribs",
			"id"		: 34
		}
	}
};

//log.info("master_carbonifier.js LOADED");

// generated ok (NO DATE)
