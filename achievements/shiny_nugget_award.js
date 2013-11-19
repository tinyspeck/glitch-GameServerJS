var name		= "Shiny Nugget Award";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Mined for ore 2003 times";
var status_text		= "You've hit the motherlode! Well, the achievement motherlode, anyway. For your assiduous pick-wielding, you've won the Shiny Nugget Award.";
var last_published	= 1348802547;
var is_shareworthy	= 1;
var url		= "shiny-nugget-award";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/shiny_nugget_award_1304983925.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/shiny_nugget_award_1304983925_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/shiny_nugget_award_1304983925_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/shiny_nugget_award_1304983925_40.png";
function on_apply(pc){
	
}
var conditions = {
	202 : {
		type	: "group_sum",
		group	: "nodes_mined",
		value	: "2003"
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
	pc.stats_add_favor_points("zille", round_to_5(150 * multiplier));
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
		"giant"		: "zille",
		"points"	: 150
	}
};

//log.info("shiny_nugget_award.js LOADED");

// generated ok (NO DATE)
