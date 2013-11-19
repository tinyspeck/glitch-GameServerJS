var name		= "Super Duper Soaker";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Watered 127 parched Fruit Trees";
var status_text		= "You've helped dozens of Fruit Trees through many a dry patch. You are indeed a Super Duper Soaker.";
var last_published	= 1348802875;
var is_shareworthy	= 1;
var url		= "super-duper-soaker";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/super_duper_soaker_1304984753.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/super_duper_soaker_1304984753_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/super_duper_soaker_1304984753_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/super_duper_soaker_1304984753_40.png";
function on_apply(pc){
	
}
var conditions = {
	346 : {
		type	: "counter",
		group	: "trants_watered",
		label	: "trant_fruit",
		value	: "127"
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
	pc.stats_add_favor_points("grendaline", round_to_5(100 * multiplier));
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
		"giant"		: "grendaline",
		"points"	: 100
	}
};

//log.info("super_duper_soaker.js LOADED");

// generated ok (NO DATE)
