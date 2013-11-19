var name		= "Not-So-Grim Reaper";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Planted 151 Crops";
var status_text		= "Oh my sod! Your nigh-perfect croppification skills have earned you a Not-So-Grim Reaper badge.";
var last_published	= 1348801940;
var is_shareworthy	= 1;
var url		= "notsogrim-reaper";
var category		= "gardens";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/notsogrim_reaper_1304983829.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/notsogrim_reaper_1304983829_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/notsogrim_reaper_1304983829_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/notsogrim_reaper_1304983829_40.png";
function on_apply(pc){
	
}
var conditions = {
	185 : {
		type	: "group_sum",
		group	: "garden_plots_planted",
		value	: "151"
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
	pc.stats_add_favor_points("mab", round_to_5(75 * multiplier));
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
		"giant"		: "mab",
		"points"	: 75
	}
};

//log.info("notsogrim_reaper.js LOADED");

// generated ok (NO DATE)
