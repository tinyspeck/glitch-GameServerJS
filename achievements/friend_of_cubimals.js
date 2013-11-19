var name		= "Friend of Cubimals";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Freed 11 Cubimals";
var status_text		= "11 Cubimals, grateful for their glorious freedom, sent me to give you this badge. They told me to tell you: \"Thank you, Friend.\"";
var last_published	= 1348798486;
var is_shareworthy	= 1;
var url		= "friend-of-cubimals";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/friend_of_cubimals_1339702831.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/friend_of_cubimals_1339702831_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/friend_of_cubimals_1339702831_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/friend_of_cubimals_1339702831_40.png";
function on_apply(pc){
	
}
var conditions = {
	706 : {
		type	: "group_sum",
		group	: "cubimals_freed",
		value	: "11"
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
	pc.stats_add_favor_points("humbaba", round_to_5(100 * multiplier));
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
		"giant"		: "humbaba",
		"points"	: 100
	}
};

//log.info("friend_of_cubimals.js LOADED");

// generated ok (NO DATE)
