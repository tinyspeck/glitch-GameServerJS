var name		= "Social Antisocialist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Set 7 Daily Records for Hi Sign evasion. Daily Records are recognized at the end of each game day";
var status_text		= "It doesn't take much to just stop and say hello: it takes a lot more effort to run from a hello. Run, run and run until you've got 7 daily records for Hi Sign evasion. Sure, being social is important. You know what else is important? Badges!";
var last_published	= 1352423982;
var is_shareworthy	= 1;
var url		= "social-antisocialist";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/social_hi_skipper_1352250573.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/social_hi_skipper_1352250573_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/social_hi_skipper_1352250573_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/social_hi_skipper_1352250573_40.png";
function on_apply(pc){
	
}
var conditions = {
	866 : {
		type	: "counter",
		group	: "daily_evasion_record",
		label	: "held",
		value	: "7"
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
	pc.stats_add_favor_points("lem", round_to_5(100 * multiplier));
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
		"giant"		: "lem",
		"points"	: 100
	}
};

//log.info("social_hi_skipper.js LOADED");

// generated ok (NO DATE)
