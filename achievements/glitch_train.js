var name		= "Glitch Train";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Participated in a 20-player follow-me parade through 5 locations";
var status_text		= "People are always looking down on being a follower. In this case it's good thing. For participating in a multi-player parade, you've just earned your Glitch Train badge!";
var last_published	= 1348798827;
var is_shareworthy	= 1;
var url		= "glitch-train";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/glitch_train_1304984900.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/glitch_train_1304984900_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/glitch_train_1304984900_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/glitch_train_1304984900_40.png";
function on_apply(pc){
	
}
var conditions = {
	596 : {
		type	: "group_count",
		group	: "glitch_train",
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 50
	}
};

//log.info("glitch_train.js LOADED");

// generated ok (NO DATE)
