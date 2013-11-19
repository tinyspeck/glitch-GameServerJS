var name		= "Haughty Culturist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Planted 1013 Crops";
var status_text		= "You've given life to multitudes of crops. How many? More numerous than there are stars in the sky. As long as there are only 1012 stars in your sky. Yes, you, Haughty Culturist: 1013 crops call you daddy.";
var last_published	= 1348799098;
var is_shareworthy	= 1;
var url		= "haughty-culturist";
var category		= "gardens";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/haughty_culturist_1315686141.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/haughty_culturist_1315686141_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/haughty_culturist_1315686141_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/haughty_culturist_1315686141_40.png";
function on_apply(pc){
	
}
var conditions = {
	576 : {
		type	: "group_sum",
		group	: "garden_plots_planted",
		value	: "1013"
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 200
	}
};

//log.info("haughty_culturist.js LOADED");

// generated ok (NO DATE)
