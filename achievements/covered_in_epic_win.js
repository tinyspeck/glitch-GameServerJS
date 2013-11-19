var name		= "Covered in Epic Win";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Contributed to each feat in 13 epics";
var status_text		= "Words are not enough to describe how epic your commitment to the epics is. Hopefully, this badge goes a little way to conveying your epic Epic epicness. It's pretty epic.";
var last_published	= 1351302451;
var is_shareworthy	= 1;
var url		= "covered-in-epic-win";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/covered_in_epic_win_1351300699.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/covered_in_epic_win_1351300699_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/covered_in_epic_win_1351300699_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/covered_in_epic_win_1351300699_40.png";
function on_apply(pc){
	
}
var conditions = {
	848 : {
		type	: "group_count",
		group	: "epics_completed",
		value	: "13"
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
	pc.stats_add_xp(round_to_5(2000 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(91 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 2000,
	"favor"	: {
		"giant"		: "all",
		"points"	: 91
	}
};

//log.info("covered_in_epic_win.js LOADED");

// generated ok (NO DATE)
