var name		= "The Daily Hi-Skipper";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Set one Daily Record for Hi Sign evasion in a location. Daily Records are recognized at the end of each game day";
var status_text		= "When old day tipped into New Day, you were the record-holding Hi-Sign evader, for skipping out on one pesky Hi-Sign in one perfectly-picked place. Those signs are fast, but you were faster. For a while, anyways. Go you!";
var last_published	= 1352423970;
var is_shareworthy	= 1;
var url		= "daily-hi-skipper";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/daily_hi_skipper_1352250569.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/daily_hi_skipper_1352250569_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/daily_hi_skipper_1352250569_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/daily_hi_skipper_1352250569_40.png";
function on_apply(pc){
	
}
var conditions = {
	865 : {
		type	: "counter",
		group	: "daily_evasion_record",
		label	: "held",
		value	: "1"
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 60
	}
};

//log.info("daily_hi_skipper.js LOADED");

// generated ok (NO DATE)
