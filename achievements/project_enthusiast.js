var name		= "Project Enthusiast";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Helped out with 53 phases of a project";
var status_text		= "For some people, hard work is its own reward. For the rest of us, there are badges. We're officially designating you a Project Enthusiast. Go, you!";
var last_published	= 1316467758;
var is_shareworthy	= 0;
var url		= "project-enthusiast";
var category		= "projects";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/project_enthusiast_1315686053.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/project_enthusiast_1315686053_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/project_enthusiast_1315686053_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/project_enthusiast_1315686053_40.png";
function on_apply(pc){
	
}
var conditions = {
	541 : {
		type	: "group_count",
		group	: "job_contributions",
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(30 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "all",
		"points"	: 30
	}
};

//log.info("project_enthusiast.js LOADED");

// generated ok (NO DATE)
