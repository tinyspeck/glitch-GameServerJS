var name		= "Major Tricksy-Treater";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gave Candy to 103 Lucky Candy-Biters during Zilloween";
var status_text		= "Apparently, some glitches were never warned about taking candy from strangers. At least 103, in fact, have deemed you non-strange enough to take candy from. What do they know, right?…";
var last_published	= 1348801536;
var is_shareworthy	= 1;
var url		= "major-tricksy-treater";
var category		= "seasonal";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/major_tricksy_treater_1319680244.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/major_tricksy_treater_1319680244_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/major_tricksy_treater_1319680244_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/major_tricksy_treater_1319680244_40.png";
function on_apply(pc){
	
}
var conditions = {
	619 : {
		type	: "group_count",
		group	: "zilloween_candy_given",
		value	: "103"
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
	pc.stats_add_favor_points("zille", round_to_5(75 * multiplier));
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
		"giant"		: "zille",
		"points"	: 75
	}
};

//log.info("major_tricksy_treater.js LOADED");

// generated ok (NO DATE)
