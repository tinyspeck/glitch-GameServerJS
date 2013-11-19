var name		= "Coat of Open Arms";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Chatted with 251 different players";
var status_text		= "Your rapacious loquaciousness has just earned you a Coat of Open Arms. We salute you!";
var last_published	= 1348797093;
var is_shareworthy	= 1;
var url		= "coat-of-open-arms";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/coat_of_open_arms_1316406761.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/coat_of_open_arms_1316406761_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/coat_of_open_arms_1316406761_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/coat_of_open_arms_1316406761_40.png";
function on_apply(pc){
	
}
var conditions = {
	220 : {
		type	: "group_count",
		group	: "talked_to",
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
	pc.stats_add_favor_points("friendly", round_to_5(125 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 125
	}
};

//log.info("coat_of_open_arms.js LOADED");

// generated ok (NO DATE)
