var name		= "Full-Time Swami";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Practiced meditation for a sum total of 251 minutes";
var status_text		= "You've spent a lot of time thinking about nothing. For some people, this would be a bad thing, but as a Full-Time Swami, you know better.";
var last_published	= 1348798494;
var is_shareworthy	= 1;
var url		= "full-time-swami";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/full_time_swami_1315686040.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/full_time_swami_1315686040_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/full_time_swami_1315686040_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/full_time_swami_1315686040_40.png";
function on_apply(pc){
	
}
var conditions = {
	536 : {
		type	: "counter",
		group	: "focusing_orb",
		label	: "meditation_time",
		value	: "251"
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
	pc.stats_add_favor_points("cosma", round_to_5(100 * multiplier));
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
		"giant"		: "cosma",
		"points"	: 100
	}
};

//log.info("full_time_swami.js LOADED");

// generated ok (NO DATE)
