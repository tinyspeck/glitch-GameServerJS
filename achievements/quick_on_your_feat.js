var name		= "Quick on Your Feat";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Contributed to a feat in the first 30 minutes";
var status_text		= "You knew what you wanted - you wanted to feat: and feat you did: first off the blocks, quick off the mark, fast as lightning, in 30 minutes or less. ZOOM!";
var last_published	= 1351302490;
var is_shareworthy	= 1;
var url		= "quick-on-your-feat";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/quick_on_your_feat_1351300710.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/quick_on_your_feat_1351300710_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/quick_on_your_feat_1351300710_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/quick_on_your_feat_1351300710_40.png";
function on_apply(pc){
	
}
var conditions = {
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(13 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "all",
		"points"	: 13
	}
};

//log.info("quick_on_your_feat.js LOADED");

// generated ok (NO DATE)
