var name		= "Odd Jobber";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Ranked as top 5 contributors for 11 phases of a project";
var status_text		= "There's no job too odd for you. For ranking among the top 5 contributors in eleven phases of a project, you've fully earned the sought-after Odd Jobber badge.";
var last_published	= 1316467798;
var is_shareworthy	= 0;
var url		= "odd-jobber";
var category		= "projects";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/odd_jobber_1315686060.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/odd_jobber_1315686060_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/odd_jobber_1315686060_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/odd_jobber_1315686060_40.png";
function on_apply(pc){
	
}
var conditions = {
	544 : {
		type	: "counter",
		group	: "job_phase_winner",
		label	: "count",
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
	pc.stats_add_xp(round_to_5(350 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(25 * multiplier));
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
		"giant"		: "all",
		"points"	: 25
	}
};

//log.info("odd_jobber.js LOADED");

// generated ok (NO DATE)
