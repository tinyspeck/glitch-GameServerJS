var name		= "OK Soaker";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Watered 11 parched Fruit Trees";
var status_text		= "Nothing sadder than a parched Fruit Tree. Good on you for watering the poor little buggers. You've been awarded the title OK Soaker.";
var last_published	= 1323931229;
var is_shareworthy	= 0;
var url		= "ok-soaker";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/ok_soaker_1304984686.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/ok_soaker_1304984686_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/ok_soaker_1304984686_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/ok_soaker_1304984686_40.png";
function on_apply(pc){
	
}
var conditions = {
	334 : {
		type	: "counter",
		group	: "trants_watered",
		label	: "trant_fruit",
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

//log.info("ok_soaker.js LOADED");

// generated ok (NO DATE)
