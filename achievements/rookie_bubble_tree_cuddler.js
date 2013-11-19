var name		= "Rookie Bubble Tree Cuddler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Petted 11 deserving Bubble Trees";
var status_text		= "The Bubble Trees appreciate your clumsy but well-intentioned petting. You've earned the status of Rookie Bubble Tree Cuddler.";
var last_published	= 1338931046;
var is_shareworthy	= 0;
var url		= "rookie-bubble-tree-cuddler";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/rookie_bubble_tree_cuddler_1304984535.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/rookie_bubble_tree_cuddler_1304984535_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/rookie_bubble_tree_cuddler_1304984535_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/rookie_bubble_tree_cuddler_1304984535_40.png";
function on_apply(pc){
	
}
var conditions = {
	310 : {
		type	: "counter",
		group	: "trants_petted",
		label	: "trant_bubble",
		value	: "11"
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(15 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 15
	}
};

//log.info("rookie_bubble_tree_cuddler.js LOADED");

// generated ok (NO DATE)
