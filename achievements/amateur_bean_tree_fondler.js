var name		= "Amateur Bean Tree Fondler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Affectionately petted 11 Bean Trees";
var status_text		= "It's been noted that you enjoy dabbling in the Bean Tree planting arts. For that, please enjoy the title Amateur Bean Tree Fondler.";
var last_published	= 1338931020;
var is_shareworthy	= 0;
var url		= "amateur-bean-tree-fondler";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/amateur_bean_tree_fondler_1304984523.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/amateur_bean_tree_fondler_1304984523_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/amateur_bean_tree_fondler_1304984523_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/amateur_bean_tree_fondler_1304984523_40.png";
function on_apply(pc){
	
}
var conditions = {
	308 : {
		type	: "counter",
		group	: "trants_petted",
		label	: "trant_bean",
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

//log.info("amateur_bean_tree_fondler.js LOADED");

// generated ok (NO DATE)
