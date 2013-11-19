var name		= "Feater of Glory";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Contributed to 17 fantastic feats";
var status_text		= "Whyfore do we feat? Some feat for fame. Some feat for the good of Ur. Others feat for glory. And there's no shame in that. There are, however, badges. Badges!";
var last_published	= 1351302468;
var is_shareworthy	= 1;
var url		= "feater-of-glory";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/feater_of_glory_1351300681.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/feater_of_glory_1351300681_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/feater_of_glory_1351300681_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/feater_of_glory_1351300681_40.png";
function on_apply(pc){
	
}
var conditions = {
	838 : {
		type	: "counter",
		group	: "feats",
		label	: "contributed",
		value	: "17"
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
	pc.stats_add_xp(round_to_5(750 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(53 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 750,
	"favor"	: {
		"giant"		: "all",
		"points"	: 53
	}
};

//log.info("feater_of_glory.js LOADED");

// generated ok (NO DATE)
