var name		= "Grand Poobah, Tinkering Ops";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Wielded a Tinkertool to repair 25013 units worth of tools";
var status_text		= "When you've repaired as many tools as you have, they don't just call you Poobah. They call you Grand Poobah. And now you have the badge to prove it.";
var last_published	= 1348798868;
var is_shareworthy	= 1;
var url		= "grand-poobah-tinkering-ops";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/grand_poobah_tinkering_ops_1304984938.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/grand_poobah_tinkering_ops_1304984938_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/grand_poobah_tinkering_ops_1304984938_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/grand_poobah_tinkering_ops_1304984938_40.png";
function on_apply(pc){
	
}
var conditions = {
	382 : {
		type	: "group_sum",
		group	: "tool_units_repaired",
		value	: "25013"
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
	pc.stats_add_xp(round_to_5(1500 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(250 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1500,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 250
	}
};

//log.info("grand_poobah_tinkering_ops.js LOADED");

// generated ok (NO DATE)
