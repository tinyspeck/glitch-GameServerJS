var name		= "Participant";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Rolled up your sleeves and contributed to all four phases of the same project";
var status_text		= "You know, during phase 1 of this project, there were some who were skeptical of your stick-to-it-iveness. But you proved them wrong. Celebrate your contribution to all phases of a four-phase project with this awesome Participant badge.";
var last_published	= 1316469069;
var is_shareworthy	= 0;
var url		= "participant";
var category		= "projects";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/participant_1315686045.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/participant_1315686045_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/participant_1315686045_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/participant_1315686045_40.png";
function on_apply(pc){
	
}
var conditions = {
	538 : {
		type	: "counter",
		group	: "job_contribution_phases",
		label	: "all",
		value	: "1"
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "all",
		"points"	: 10
	}
};

//log.info("participant.js LOADED");

// generated ok (NO DATE)
