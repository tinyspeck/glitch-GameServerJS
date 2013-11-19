var name		= "Endurance Misanthrope";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Set 547 Daily Records for Hi Sign evasion. Daily Records are recognized at the end of each game day";
var status_text		= "Sure, they might only have been saying Hi, but that doesn't mean you have to hang around to be Hi'ed. And you haven't: running so fast and so far, you've set 547 daily records for taking social avoidance to new measures. WOO!";
var last_published	= 1352423997;
var is_shareworthy	= 1;
var url		= "endurance-misanthrope";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/endurance_hi_skipper_1352250829.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/endurance_hi_skipper_1352250829_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/endurance_hi_skipper_1352250829_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/endurance_hi_skipper_1352250829_40.png";
function on_apply(pc){
	
}
var conditions = {
	869 : {
		type	: "counter",
		group	: "daily_evasion_record",
		label	: "held",
		value	: "547"
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
	pc.stats_add_xp(round_to_5(1800 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(360 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1800,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 360
	}
};

//log.info("endurance_hi_skipper.js LOADED");

// generated ok (NO DATE)
