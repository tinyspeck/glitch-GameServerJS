var name		= "Compulsive Re-Peater";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 283 slightly funky Blocks of Peat";
var status_text		= "You know what they say about harvesting Blocks of Peat: once you start, you can't stop. Now you can celebrate your stick-to-it-iveness with the title Compulsive Re-Peater.";
var last_published	= 1338921404;
var is_shareworthy	= 0;
var url		= "compulsive-re-peater";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/compulsive_re_peater_1315686008.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/compulsive_re_peater_1315686008_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/compulsive_re_peater_1315686008_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/compulsive_re_peater_1315686008_40.png";
function on_apply(pc){
	
}
var conditions = {
	524 : {
		type	: "counter",
		group	: "completed_harvest",
		label	: "peat_bog",
		value	: "283"
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
	pc.stats_add_xp(round_to_5(350 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(45 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 350,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 45
	}
};

//log.info("compulsive_re_peater.js LOADED");

// generated ok (NO DATE)
