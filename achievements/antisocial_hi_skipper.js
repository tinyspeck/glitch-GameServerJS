var name		= "Marathon Maverick";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Set 37 Daily Records for Hi Sign evasion. Daily Records are recognized at the end of each game day";
var status_text		= "No stranger to being a stranger, you've run so far and so fast from friendly greetings that you've garnered 37 daily records for Hi Sign Evasion. Howdy, Stranger. And Mazel Tov, Maverick: here's your badge.";
var last_published	= 1352423988;
var is_shareworthy	= 1;
var url		= "marathon-maverick";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/antisocial_hi_skipper_1352250575.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/antisocial_hi_skipper_1352250575_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/antisocial_hi_skipper_1352250575_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/antisocial_hi_skipper_1352250575_40.png";
function on_apply(pc){
	
}
var conditions = {
	867 : {
		type	: "counter",
		group	: "daily_evasion_record",
		label	: "held",
		value	: "37"
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
	pc.stats_add_xp(round_to_5(750 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 750,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 150
	}
};

//log.info("antisocial_hi_skipper.js LOADED");

// generated ok (NO DATE)
