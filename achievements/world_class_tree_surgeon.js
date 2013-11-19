var name		= "World-class Tree Surgeon";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Administered antidote to 251 trees";
var status_text		= "When you're a World-class Tree Surgeon who has saved 251 trees from certain unpleasantness, you don't need to put on airs with the tree community. You can breeze past with a saintly air, a song in your heart, and the gratitude of 251 trees under your belt.";
var last_published	= 1348803108;
var is_shareworthy	= 1;
var url		= "world-class-tree-surgeon";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/world_class_tree_surgeon_1336506019.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/world_class_tree_surgeon_1336506019_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/world_class_tree_surgeon_1336506019_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/world_class_tree_surgeon_1336506019_40.png";
function on_apply(pc){
	
}
var conditions = {
	475 : {
		type	: "counter",
		group	: "tree_antidote",
		label	: "antidoted",
		value	: "251"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 100
	}
};

//log.info("world_class_tree_surgeon.js LOADED");

// generated ok (NO DATE)
