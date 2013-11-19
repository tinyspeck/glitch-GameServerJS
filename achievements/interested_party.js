var name		= "Interested Party";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Helped out with 5 phases of a project";
var status_text		= "You like helping out. We like that you like helping out. We like it so much we're awarding you the title Interested Party. Is it the flashiest title out there? No sir, it is not. But there you go.";
var last_published	= 1316467706;
var is_shareworthy	= 0;
var url		= "interested-party";
var category		= "projects";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/interested_party_1315686048.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/interested_party_1315686048_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/interested_party_1315686048_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/interested_party_1315686048_40.png";
function on_apply(pc){
	
}
var conditions = {
	539 : {
		type	: "group_count",
		group	: "job_contributions",
		value	: "5"
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

//log.info("interested_party.js LOADED");

// generated ok (NO DATE)
