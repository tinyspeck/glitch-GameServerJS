var name		= "Better-Than-Mediocre Fruit Tree Pettifier";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Satisfactorily pettified 41 Fruit Trees";
var status_text		= "These Fruit Trees may have had better petting, but they've had worse, too. Celebrate your adequateness with your newfound title Better-Than-Mediocre Fruit Tree Pettifier.";
var last_published	= 1338931250;
var is_shareworthy	= 0;
var url		= "betterthanmediocre-fruit-tree-pettifier";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/betterthanmediocre_fruit_tree_pettifier_1304984577.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/betterthanmediocre_fruit_tree_pettifier_1304984577_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/betterthanmediocre_fruit_tree_pettifier_1304984577_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/betterthanmediocre_fruit_tree_pettifier_1304984577_40.png";
function on_apply(pc){
	
}
var conditions = {
	318 : {
		type	: "counter",
		group	: "trants_petted",
		label	: "trant_fruit",
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
	pc.stats_add_favor_points("grendaline", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 40
	}
};

//log.info("betterthanmediocre_fruit_tree_pettifier.js LOADED");

// generated ok (NO DATE)
