var name		= "Rainmaking Noob";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Dispensed a good watering to 11 Bean Trees";
var status_text		= "With this, your eleventh Bean Tree watering, you've taken your journey down a damp but rewarding path. You deserve the honorable title Rainmaking Noob.";
var last_published	= 1323925572;
var is_shareworthy	= 0;
var url		= "rainmaking-noob";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/rainmaking_noob_1304984672.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/rainmaking_noob_1304984672_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/rainmaking_noob_1304984672_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/rainmaking_noob_1304984672_40.png";
function on_apply(pc){
	
}
var conditions = {
	331 : {
		type	: "counter",
		group	: "trants_watered",
		label	: "trant_bean",
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(15 * multiplier));
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
		"giant"		: "grendaline",
		"points"	: 15
	}
};

//log.info("rainmaking_noob.js LOADED");

// generated ok (NO DATE)
