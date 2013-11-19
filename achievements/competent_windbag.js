var name		= "Competent Windbag";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Chatted with 29 different players";
var status_text		= "Your way with windbaggery is a wonder to behold! You've earned the title Competent Windbag.";
var last_published	= 1348797102;
var is_shareworthy	= 1;
var url		= "competent-windbag";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/competent_windbag_1316406755.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/competent_windbag_1316406755_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/competent_windbag_1316406755_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/competent_windbag_1316406755_40.png";
function on_apply(pc){
	
}
var conditions = {
	218 : {
		type	: "group_count",
		group	: "talked_to",
		value	: "29"
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
	pc.stats_add_favor_points("friendly", round_to_5(45 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 45
	}
};

//log.info("competent_windbag.js LOADED");

// generated ok (NO DATE)
