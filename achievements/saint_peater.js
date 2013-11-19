var name		= "Saint Peater";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 5003 slightly funky Blocks of Peat";
var status_text		= "With 5003 successfully harvested Blocks of Peat under your belt, it's probably time to get a bigger belt. Purely up to you, of course. Just think about it while you ponder the awesomeness of your new title: Saint Peater.";
var last_published	= 1348802506;
var is_shareworthy	= 1;
var url		= "saint-peater";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/saint_peater_1315686015.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/saint_peater_1315686015_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/saint_peater_1315686015_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/saint_peater_1315686015_40.png";
function on_apply(pc){
	
}
var conditions = {
	527 : {
		type	: "counter",
		group	: "completed_harvest",
		label	: "peat_bog",
		value	: "5003"
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(175 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 175
	}
};

//log.info("saint_peater.js LOADED");

// generated ok (NO DATE)
