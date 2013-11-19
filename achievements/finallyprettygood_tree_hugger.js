var name		= "Finally-Pretty-Good Tree Hugger";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Braved splinters to pet 1009 Trees";
var status_text		= "Despite your mismatched heights, you have excelled in the splintery field of Tree petting. Enjoy your Finally-Pretty-Good Tree Hugger status.";
var last_published	= 1348798446;
var is_shareworthy	= 1;
var url		= "finallyprettygood-tree-hugger";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/finallyprettygood_tree_hugger_1304984667.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/finallyprettygood_tree_hugger_1304984667_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/finallyprettygood_tree_hugger_1304984667_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/finallyprettygood_tree_hugger_1304984667_40.png";
function on_apply(pc){
	
}
var conditions = {
	330 : {
		type	: "group_sum",
		group	: "trants_petted",
		value	: "1009"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 150
	}
};

//log.info("finallyprettygood_tree_hugger.js LOADED");

// generated ok (NO DATE)
