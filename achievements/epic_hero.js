var name		= "Epic Hero";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Contributed to each feat in one epic";
var status_text		= "Every feat in one epic, you did your bit. It's Glitches like you that ensure the growth of Ur. And that's what makes you both an Epic Hero, and a hero of epic proportions.";
var last_published	= 1351302435;
var is_shareworthy	= 1;
var url		= "epic-hero";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/epic_hero_1351300692.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/epic_hero_1351300692_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/epic_hero_1351300692_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/epic_hero_1351300692_40.png";
function on_apply(pc){
	
}
var conditions = {
	849 : {
		type	: "group_count",
		group	: "epics_completed",
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(17 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "all",
		"points"	: 17
	}
};

//log.info("epic_hero.js LOADED");

// generated ok (NO DATE)
