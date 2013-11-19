var name		= "Tinker Trainee, Kitchen Division";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Tinkertool to repair 3 cooking tools from their half-life to a fully-repaired state";
var status_text		= "Where would the world be without cooking tool fixers like yourself? Probably without access to much-needed snacks, that's where. Bravo. You've earned the title Tinker Trainee, Kitchen Division.";
var last_published	= 1340231247;
var is_shareworthy	= 0;
var url		= "tinker-trainee-kitchen-division";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/tinker_trainee_kitchen_division_1304984908.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/tinker_trainee_kitchen_division_1304984908_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/tinker_trainee_kitchen_division_1304984908_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/tinker_trainee_kitchen_division_1304984908_40.png";
function on_apply(pc){
	
}
var conditions = {
	376 : {
		type	: "group_sum",
		group	: "cookingtools_repaired",
		value	: "3"
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
	pc.stats_add_favor_points("alph", round_to_5(40 * multiplier));
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
		"giant"		: "alph",
		"points"	: 40
	}
};

//log.info("tinker_trainee_kitchen_division.js LOADED");

// generated ok (NO DATE)
