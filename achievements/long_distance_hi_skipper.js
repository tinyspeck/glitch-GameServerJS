var name		= "Long-Distance Lone Wolf";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Set 137 Daily Records for Hi Sign evasion. Daily Records are recognized at the end of each game day";
var status_text		= "You keep running, running and running, running and running, running and running, running. Away from hi-signs, mainly: or enough times to set 137 daily records for Hi Sign evasion, anyway. Run on, Lone Wolf.";
var last_published	= 1352423992;
var is_shareworthy	= 1;
var url		= "long-distance-lone-wolf";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/long_distance_hi_skipper_1352250825.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/long_distance_hi_skipper_1352250825_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/long_distance_hi_skipper_1352250825_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/long_distance_hi_skipper_1352250825_40.png";
function on_apply(pc){
	
}
var conditions = {
	868 : {
		type	: "counter",
		group	: "daily_evasion_record",
		label	: "held",
		value	: "137"
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
	pc.stats_add_xp(round_to_5(1200 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(240 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1200,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 240
	}
};

//log.info("long_distance_hi_skipper.js LOADED");

// generated ok (NO DATE)
