var name		= "Senior Mending Manager, Kitchen Division";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Tinkertool to repair 127 cooking tools from their half-life to a fully-repaired state";
var status_text		= "The world would be a hungrier, grouchier, angrier place without your Tinkering skills. Stare at this Senior Mending Manager badge every day and say to yourself: I am a shining star, a bright shining star.";
var last_published	= 1348802534;
var is_shareworthy	= 1;
var url		= "senior-mending-manager-kitchen-division";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-20\/senior_mending_manager_kitchen_division_1340231139.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-20\/senior_mending_manager_kitchen_division_1340231139_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-20\/senior_mending_manager_kitchen_division_1340231139_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-20\/senior_mending_manager_kitchen_division_1340231139_40.png";
function on_apply(pc){
	
}
var conditions = {
	378 : {
		type	: "group_sum",
		group	: "cookingtools_repaired",
		value	: "127"
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
	pc.stats_add_favor_points("alph", round_to_5(150 * multiplier));
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
		"giant"		: "alph",
		"points"	: 150
	}
};

//log.info("senior_mending_manager_kitchen_division.js LOADED");

// generated ok (NO DATE)
