var name		= "Decent Tree Hugger";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Braved splinters to pet 41 Trees";
var status_text		= "Your Tree petting is improving, but there's always room for improved improvement. While you work on that, enjoy this Decent Tree Hugger badge.";
var last_published	= 1338931302;
var is_shareworthy	= 0;
var url		= "decent-tree-hugger";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/decent_tree_hugger_1304984555.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/decent_tree_hugger_1304984555_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/decent_tree_hugger_1304984555_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/decent_tree_hugger_1304984555_40.png";
function on_apply(pc){
	
}
var conditions = {
	314 : {
		type	: "group_sum",
		group	: "trants_petted",
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 20
	}
};

//log.info("decent_tree_hugger.js LOADED");

// generated ok (NO DATE)
