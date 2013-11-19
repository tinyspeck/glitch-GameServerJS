var name		= "Entry-Level Fruit Tree Harvester";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Plucked 101 pieces of Fruit";
var status_text		= "We like your pluck. For harvesting 101 pieces of fruit, you've earned the title Entry-Level Fruit Tree Harvester.";
var last_published	= 1336502632;
var is_shareworthy	= 0;
var url		= "entrylevel-fruit-tree-harvester";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/entrylevel_fruit_tree_harvester_1304984397.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/entrylevel_fruit_tree_harvester_1304984397_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/entrylevel_fruit_tree_harvester_1304984397_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/entrylevel_fruit_tree_harvester_1304984397_40.png";
function on_apply(pc){
	
}
var conditions = {
	286 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "cherry",
		value	: "101"
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
	pc.stats_add_favor_points("spriggan", round_to_5(15 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 15
	}
};

//log.info("entrylevel_fruit_tree_harvester.js LOADED");

// generated ok (NO DATE)
