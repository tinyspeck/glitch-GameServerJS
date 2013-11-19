var name		= "Regular Whack Job";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Hatchet to clear 53 dead Trees";
var status_text		= "You've shivered those timbers well and good. Once the wood chips have settled, take a moment to admire your brand plankin' new Regular Whack Job badge.";
var last_published	= 1348802480;
var is_shareworthy	= 1;
var url		= "regular-whack-job";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/regular_whack_job_1304984265.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/regular_whack_job_1304984265_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/regular_whack_job_1304984265_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/regular_whack_job_1304984265_40.png";
function on_apply(pc){
	
}
var conditions = {
	261 : {
		type	: "group_sum",
		group	: "dead_trants_cleared",
		value	: "53"
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(30 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 30
	}
};

//log.info("regular_whack_job.js LOADED");

// generated ok (NO DATE)
