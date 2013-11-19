var name		= "Feat First";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Contributed to one fabulous feat";
var status_text		= "Your conch blown, you took your chance and played your part. In what? A feat! For why? Because it was there! And now? You got a badge for it! Yay!";
var last_published	= 1351302457;
var is_shareworthy	= 1;
var url		= "feat-first";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/feat_first_1351300676.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/feat_first_1351300676_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/feat_first_1351300676_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/feat_first_1351300676_40.png";
function on_apply(pc){
	
}
var conditions = {
	836 : {
		type	: "counter",
		group	: "feats",
		label	: "contributed",
		value	: "1"
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
	pc.stats_add_xp(round_to_5(111 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(11 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 111,
	"favor"	: {
		"giant"		: "all",
		"points"	: 11
	}
};

//log.info("feat_first.js LOADED");

// generated ok (NO DATE)
