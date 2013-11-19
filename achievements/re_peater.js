var name		= "Re-Peater";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 41 slightly funky Blocks of Peat";
var status_text		= "For rescuing 41 Blocks of Peat from a dreary, if peaceful, bog existence, you've just earned the title Re-Peater.";
var last_published	= 1338921375;
var is_shareworthy	= 0;
var url		= "re-peater";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/re_peater_1315686006.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/re_peater_1315686006_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/re_peater_1315686006_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/re_peater_1315686006_40.png";
function on_apply(pc){
	
}
var conditions = {
	523 : {
		type	: "counter",
		group	: "completed_harvest",
		label	: "peat_bog",
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 20
	}
};

//log.info("re_peater.js LOADED");

// generated ok (NO DATE)
