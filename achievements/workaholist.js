var name		= "Workaholist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Ranked as top 5 contributors for 127 phases of a project";
var status_text		= "Whoa. You've been a top 5 contributor on, what, 79 phases of a project now? You're like a hooch-aholic, but for work! We hereby dub you a Workaholist.";
var last_published	= 1316467868;
var is_shareworthy	= 0;
var url		= "workaholist";
var category		= "projects";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/workaholist_1315686067.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/workaholist_1315686067_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/workaholist_1315686067_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/workaholist_1315686067_40.png";
function on_apply(pc){
	
}
var conditions = {
	547 : {
		type	: "counter",
		group	: "job_phase_winner",
		label	: "count",
		value	: "127"
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
	pc.stats_add_xp(round_to_5(1250 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(225 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1250,
	"favor"	: {
		"giant"		: "all",
		"points"	: 225
	}
};

//log.info("workaholist.js LOADED");

// generated ok (NO DATE)
