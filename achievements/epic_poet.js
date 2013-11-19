var name		= "Epic Poet";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Added something to each feat in 3 epics";
var status_text		= "Tireless is the tiny glitch who works upon the feat, doing all that must be done, a-pounding every street. Three-epicfuls of feats you did, and that is quite a lot: and that explains why (happily) this badge you have just got. Hurrah!";
var last_published	= 1351302441;
var is_shareworthy	= 1;
var url		= "epic-poet";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/epic_poet_1351300694.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/epic_poet_1351300694_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/epic_poet_1351300694_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/epic_poet_1351300694_40.png";
function on_apply(pc){
	
}
var conditions = {
	846 : {
		type	: "group_count",
		group	: "epics_completed",
		value	: "3"
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(37 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "all",
		"points"	: 37
	}
};

//log.info("epic_poet.js LOADED");

// generated ok (NO DATE)
