var name		= "Trainee Tree Medic";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Administered antidote to 23 trees";
var status_text		= "You have saved the lives of 23 trees with your antidote administering skills. Prepare to learn how trees show gratitude to a Trainee Tree Medic. (That would be you).";
var last_published	= 1348803068;
var is_shareworthy	= 1;
var url		= "trainee-tree-medic";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/trainee_tree_medic_1336506057.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/trainee_tree_medic_1336506057_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/trainee_tree_medic_1336506057_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/trainee_tree_medic_1336506057_40.png";
function on_apply(pc){
	
}
var conditions = {
	472 : {
		type	: "counter",
		group	: "tree_antidote",
		label	: "antidoted",
		value	: "23"
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(30 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 30
	}
};

//log.info("trainee_tree_medic.js LOADED");

// generated ok (NO DATE)
