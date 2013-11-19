var name		= "Elbow Grease Monkey";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Ranked as top 5 contributors for 79 phases of a project";
var status_text		= "You're never afraid to roll up your sleeves and show us just how greasy your elbows can get. Elbow Grease Monkey seemed like an appropriate honorific.";
var last_published	= 1316467836;
var is_shareworthy	= 0;
var url		= "elbow-grease-monkey";
var category		= "projects";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/elbow_grease_monkey_1315686065.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/elbow_grease_monkey_1315686065_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/elbow_grease_monkey_1315686065_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/elbow_grease_monkey_1315686065_40.png";
function on_apply(pc){
	
}
var conditions = {
	546 : {
		type	: "counter",
		group	: "job_phase_winner",
		label	: "count",
		value	: "79"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "all",
		"points"	: 50
	}
};

//log.info("elbow_grease_monkey.js LOADED");

// generated ok (NO DATE)
