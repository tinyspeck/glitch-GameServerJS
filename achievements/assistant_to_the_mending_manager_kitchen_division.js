var name		= "Assistant to the Mending Manager, Kitchen Division";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Tinkertool to repair 23 cooking tools from their half-life to a fully-repaired state";
var status_text		= "You've wielded your Tinkertool to great avail. You deserve this promotion to the rank of Assistant to the Mending Manager, Kitchen Division.";
var last_published	= 1340231255;
var is_shareworthy	= 0;
var url		= "assistant-to-the-mending-manager-kitchen-division";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/assistant_to_the_mending_manager_kitchen_division_1304984912.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/assistant_to_the_mending_manager_kitchen_division_1304984912_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/assistant_to_the_mending_manager_kitchen_division_1304984912_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/assistant_to_the_mending_manager_kitchen_division_1304984912_40.png";
function on_apply(pc){
	
}
var conditions = {
	377 : {
		type	: "group_sum",
		group	: "cookingtools_repaired",
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 100
	}
};

//log.info("assistant_to_the_mending_manager_kitchen_division.js LOADED");

// generated ok (NO DATE)
