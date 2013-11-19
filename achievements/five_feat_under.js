var name		= "Five Feat Under";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Contributed to five amazing feats";
var status_text		= "Five feats would have been that little less featy had you not feated. But feat you did, and, with Five Feats Under your belt, you earned yourself one shiny badge too. Coo!";
var last_published	= 1351302462;
var is_shareworthy	= 1;
var url		= "five-feat-under";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/five_feat_under_1351300678.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/five_feat_under_1351300678_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/five_feat_under_1351300678_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/five_feat_under_1351300678_40.png";
function on_apply(pc){
	
}
var conditions = {
	837 : {
		type	: "counter",
		group	: "feats",
		label	: "contributed",
		value	: "5"
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
	pc.stats_add_favor_points("all", round_to_5(29 * multiplier));
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
		"giant"		: "all",
		"points"	: 29
	}
};

//log.info("five_feat_under.js LOADED");

// generated ok (NO DATE)
