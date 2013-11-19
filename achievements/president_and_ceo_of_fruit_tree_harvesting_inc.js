var name		= "President and CEO of Fruit Tree Harvesting Inc.";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Plucked 5003 pieces of Fruit";
var status_text		= "You've plucked your way to the top of the tree. As President and CEO of Fruit Tree Harvesting Inc., you are now well within your rights to go mad with power.";
var last_published	= 1348802253;
var is_shareworthy	= 1;
var url		= "president-and-ceo-of-fruit-tree-harvesting-inc";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/president_and_ceo_of_fruit_tree_harvesting_inc_1304984502.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/president_and_ceo_of_fruit_tree_harvesting_inc_1304984502_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/president_and_ceo_of_fruit_tree_harvesting_inc_1304984502_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/president_and_ceo_of_fruit_tree_harvesting_inc_1304984502_40.png";
function on_apply(pc){
	
}
var conditions = {
	304 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "cherry",
		value	: "5003"
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
	pc.stats_add_favor_points("spriggan", round_to_5(150 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 150
	}
};

//log.info("president_and_ceo_of_fruit_tree_harvesting_inc.js LOADED");

// generated ok (NO DATE)
