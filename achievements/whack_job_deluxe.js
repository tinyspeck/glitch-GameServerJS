var name		= "Whack Job Deluxe";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Hatchet to clear 151 dead Trees";
var status_text		= "Some people can't see the forest for the trees. But not you. You just chop 'em down, earning your whack-happy self the title Whack Job Deluxe.";
var last_published	= 1348803098;
var is_shareworthy	= 1;
var url		= "whack-job-deluxe";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/whack_job_deluxe_1304984270.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/whack_job_deluxe_1304984270_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/whack_job_deluxe_1304984270_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/whack_job_deluxe_1304984270_40.png";
function on_apply(pc){
	
}
var conditions = {
	262 : {
		type	: "group_sum",
		group	: "dead_trants_cleared",
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
	pc.stats_add_xp(round_to_5(350 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(45 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 350,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 45
	}
};

//log.info("whack_job_deluxe.js LOADED");

// generated ok (NO DATE)
