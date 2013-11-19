var name		= "Nouveau Whack Job";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Hatchet to clear 11 dead Trees";
var status_text		= "Now that's some mighty nice tree clearing. You've just earned the title Nouveau Whack Job.";
var last_published	= 1338927385;
var is_shareworthy	= 0;
var url		= "nouveau-whack-job";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/nouveau_whack_job_1304984259.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/nouveau_whack_job_1304984259_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/nouveau_whack_job_1304984259_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/nouveau_whack_job_1304984259_40.png";
function on_apply(pc){
	
}
var conditions = {
	260 : {
		type	: "group_sum",
		group	: "dead_trants_cleared",
		value	: "11"
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(15 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 15
	}
};

//log.info("nouveau_whack_job.js LOADED");

// generated ok (NO DATE)
