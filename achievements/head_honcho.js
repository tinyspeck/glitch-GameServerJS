var name		= "Head Honcho";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Ranked as top 5 contributors for 503 phases of a project";
var status_text		= "When you've been a top contributor on 503 project phases, they should call you the Head Honcho. Which they will. Because now you are.";
var last_published	= 1316467882;
var is_shareworthy	= 0;
var url		= "head-honcho";
var category		= "projects";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/head_honcho_1315686071.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/head_honcho_1315686071_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/head_honcho_1315686071_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/head_honcho_1315686071_40.png";
function on_apply(pc){
	
}
var conditions = {
	595 : {
		type	: "counter",
		group	: "job_phase_winner",
		label	: "count",
		value	: "503"
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
	pc.stats_add_xp(round_to_5(2000 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(300 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 2000,
	"favor"	: {
		"giant"		: "all",
		"points"	: 300
	}
};

//log.info("head_honcho.js LOADED");

// generated ok (NO DATE)
