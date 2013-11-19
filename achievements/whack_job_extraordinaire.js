var name		= "Whack Job Extraordinaire";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Hatchet to clear 401 dead Trees";
var status_text		= "Ashes to ashes. Dust to dust. Trees to planks. It's the cycle of life, and you are the newly anointed Whack Job Extraordinaire who drives that cycle.";
var last_published	= 1348803102;
var is_shareworthy	= 1;
var url		= "whack-job-extraordinaire";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/whack_job_extraordinaire_1304984276.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/whack_job_extraordinaire_1304984276_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/whack_job_extraordinaire_1304984276_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/whack_job_extraordinaire_1304984276_40.png";
function on_apply(pc){
	
}
var conditions = {
	263 : {
		type	: "group_sum",
		group	: "dead_trants_cleared",
		value	: "401"
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

//log.info("whack_job_extraordinaire.js LOADED");

// generated ok (NO DATE)
