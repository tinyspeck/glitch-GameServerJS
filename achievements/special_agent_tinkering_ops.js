var name		= "Special Agent, Tinkering Ops";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Wielded a Tinkertool to repair 10009 units worth of tools";
var status_text		= "You've tinkered your way to the status of Special Agent, Tinkering Ops. We're still working on the secret handshake. We'll keep you posted on that.";
var last_published	= 1348802856;
var is_shareworthy	= 1;
var url		= "special-agent-tinkering-ops";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/special_agent_tinkering_ops_1304984933.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/special_agent_tinkering_ops_1304984933_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/special_agent_tinkering_ops_1304984933_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/special_agent_tinkering_ops_1304984933_40.png";
function on_apply(pc){
	
}
var conditions = {
	381 : {
		type	: "group_sum",
		group	: "tool_units_repaired",
		value	: "10009"
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

//log.info("special_agent_tinkering_ops.js LOADED");

// generated ok (NO DATE)
