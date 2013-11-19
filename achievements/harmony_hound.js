var name		= "Harmony Hound";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Practiced meditation for a sum total of 101 minutes";
var status_text		= "Om yeah! You've been at one with the Oneness for 101 minutes. We're not quite sure what the phrase Harmony Hound means, but whatever it is, you're it.";
var last_published	= 1348799094;
var is_shareworthy	= 1;
var url		= "harmony-hound";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/harmony_hound_1315686037.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/harmony_hound_1315686037_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/harmony_hound_1315686037_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/harmony_hound_1315686037_40.png";
function on_apply(pc){
	
}
var conditions = {
	535 : {
		type	: "counter",
		group	: "focusing_orb",
		label	: "meditation_time",
		value	: "101"
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("cosma", round_to_5(75 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "cosma",
		"points"	: 75
	}
};

//log.info("harmony_hound.js LOADED");

// generated ok (NO DATE)
