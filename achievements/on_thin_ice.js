var name		= "On Thin Ice";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Released 467 Ice from Nubbins";
var status_text		= "You've endured the cold, the stress, the chilblains and the chilly ears, and in scraping these latest few cubical ice lumps, you've earned a badge for 467 over time. Yes. Today was a good day.";
var last_published	= 1351879461;
var is_shareworthy	= 1;
var url		= "on-thin-ice";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/on_thin_ice_1351618917.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/on_thin_ice_1351618917_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/on_thin_ice_1351618917_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/on_thin_ice_1351618917_40.png";
function on_apply(pc){
	
}
var conditions = {
	861 : {
		type	: "counter",
		group	: "ice",
		label	: "ice_received",
		value	: "467"
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
	pc.stats_add_favor_points("grendaline", round_to_5(80 * multiplier));
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
		"giant"		: "grendaline",
		"points"	: 80
	}
};

//log.info("on_thin_ice.js LOADED");

// generated ok (NO DATE)
