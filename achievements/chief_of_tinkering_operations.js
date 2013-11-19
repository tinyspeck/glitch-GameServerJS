var name		= "Chief of Tinkering Operations";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Wielded a Tinkertool to repair 2503 units worth of tools";
var status_text		= "After endlessly tinkering in the shadows, you can finally get the respect you deserve with this new title: Chief of Tinkering Operations. Token? Sure. But sounds good at parties.";
var last_published	= 1323922172;
var is_shareworthy	= 0;
var url		= "chief-of-tinkering-operations";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/chief_of_tinkering_operations_1304984928.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/chief_of_tinkering_operations_1304984928_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/chief_of_tinkering_operations_1304984928_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/chief_of_tinkering_operations_1304984928_40.png";
function on_apply(pc){
	
}
var conditions = {
	380 : {
		type	: "group_sum",
		group	: "tool_units_repaired",
		value	: "2503"
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
	pc.stats_add_favor_points("alph", round_to_5(100 * multiplier));
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
		"giant"		: "alph",
		"points"	: 100
	}
};

//log.info("chief_of_tinkering_operations.js LOADED");

// generated ok (NO DATE)
