var name		= "About Average Irrigationist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Wetly watered 41 Egg Plants";
var status_text		= "So far, the Egg Plants seem to like what you're putting out. With practically no complaints coming in, you are now officially an About Average Irrigationist.";
var last_published	= 1323925673;
var is_shareworthy	= 0;
var url		= "about-average-irrigationist";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/about_average_irrigationist_1304984711.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/about_average_irrigationist_1304984711_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/about_average_irrigationist_1304984711_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/about_average_irrigationist_1304984711_40.png";
function on_apply(pc){
	
}
var conditions = {
	338 : {
		type	: "counter",
		group	: "trants_watered",
		label	: "trant_egg",
		value	: "41"
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
	pc.stats_add_favor_points("grendaline", round_to_5(40 * multiplier));
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
		"giant"		: "grendaline",
		"points"	: 40
	}
};

//log.info("about_average_irrigationist.js LOADED");

// generated ok (NO DATE)
