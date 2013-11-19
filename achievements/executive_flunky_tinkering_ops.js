var name		= "Executive Flunky, Tinkering Ops";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Wielded a Tinkertool to repair 1009 units worth of tools";
var status_text		= "There are jobs, and there are careers. And then there is what you do. Congratulations on successfully tinkering your way to the title Executive Flunky, Tinkering Ops. Remember, you can only go up from here.";
var last_published	= 1323922172;
var is_shareworthy	= 0;
var url		= "executive-flunky-tinkering-ops";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/executive_flunky_tinkering_ops_1304984922.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/executive_flunky_tinkering_ops_1304984922_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/executive_flunky_tinkering_ops_1304984922_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/executive_flunky_tinkering_ops_1304984922_40.png";
function on_apply(pc){
	
}
var conditions = {
	379 : {
		type	: "group_sum",
		group	: "tool_units_repaired",
		value	: "1009"
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 50
	}
};

//log.info("executive_flunky_tinkering_ops.js LOADED");

// generated ok (NO DATE)
