var name		= "OK-But-Needs-Improvement Tree Hugger";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Braved splinters to pet 7 Trees";
var status_text		= "That's some all-right Tree petting. You've just earned an OK-But-Needs-Improvement Tree Hugger badge.";
var last_published	= 1349313854;
var is_shareworthy	= 1;
var url		= "okbutneedsimprovement-tree-hugger";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/okbutneedsimprovement_tree_hugger_1304984517.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/okbutneedsimprovement_tree_hugger_1304984517_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/okbutneedsimprovement_tree_hugger_1304984517_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/okbutneedsimprovement_tree_hugger_1304984517_40.png";
function on_apply(pc){
	
}
var conditions = {
	307 : {
		type	: "group_sum",
		group	: "trants_petted",
		value	: "7"
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
	pc.stats_add_favor_points("grendaline", round_to_5(10 * multiplier));
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
		"points"	: 10
	}
};

//log.info("okbutneedsimprovement_tree_hugger.js LOADED");

// generated ok (NO DATE)
