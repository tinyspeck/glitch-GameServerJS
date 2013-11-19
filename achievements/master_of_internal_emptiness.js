var name		= "Master of Internal Emptiness";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Practiced meditation for a sum total of 503 minutes";
var status_text		= "Boo-ya! Who's the serenest? You are, and you have the Master of Internal Emptiness badge to prove it. In your face, Swami Jeff!";
var last_published	= 1348801853;
var is_shareworthy	= 1;
var url		= "master-of-internal-emptiness";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/master_of_internal_emptiness_1315686042.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/master_of_internal_emptiness_1315686042_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/master_of_internal_emptiness_1315686042_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/master_of_internal_emptiness_1315686042_40.png";
function on_apply(pc){
	
}
var conditions = {
	537 : {
		type	: "counter",
		group	: "focusing_orb",
		label	: "meditation_time",
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	pc.stats_add_favor_points("cosma", round_to_5(175 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800,
	"favor"	: {
		"giant"		: "cosma",
		"points"	: 175
	}
};

//log.info("master_of_internal_emptiness.js LOADED");

// generated ok (NO DATE)
