var name		= "Hanky Splanky";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Administered fun-but-firm splankings to 23 players";
var status_text		= "You have a hankering for a-splankering. Let your shiny new Hanky Splanky badge serve as a warning to your friends and associates.";
var last_published	= 1348798896;
var is_shareworthy	= 1;
var url		= "hanky-splanky";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hanky_splanky_1304984904.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hanky_splanky_1304984904_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hanky_splanky_1304984904_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hanky_splanky_1304984904_40.png";
function on_apply(pc){
	
}
var conditions = {
	375 : {
		type	: "group_count",
		group	: "players_splanked",
		value	: "23"
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(11 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 11
	}
};

//log.info("hanky_splanky.js LOADED");

// generated ok (NO DATE)
