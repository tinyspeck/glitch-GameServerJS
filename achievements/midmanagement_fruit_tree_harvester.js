var name		= "Mid-Management Fruit Tree Harvester";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Plucked 503 pieces of Fruit";
var status_text		= "You've plucked your way to the level of Mid-Management Fruit Tree Harvesters. Time to go moderately mad with your moderate amount of power.";
var last_published	= 1348801883;
var is_shareworthy	= 1;
var url		= "midmanagement-fruit-tree-harvester";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/midmanagement_fruit_tree_harvester_1304984431.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/midmanagement_fruit_tree_harvester_1304984431_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/midmanagement_fruit_tree_harvester_1304984431_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/midmanagement_fruit_tree_harvester_1304984431_40.png";
function on_apply(pc){
	
}
var conditions = {
	292 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "cherry",
		value	: "503"
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
	pc.stats_add_favor_points("spriggan", round_to_5(40 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 40
	}
};

//log.info("midmanagement_fruit_tree_harvester.js LOADED");

// generated ok (NO DATE)
