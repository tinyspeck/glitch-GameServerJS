var name		= "Senior OK Explorer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited 23 new locations.";
var status_text		= "Rollin', rollin', rollin', keep them doggies rollin' with this Senior OK Explorer badge.";
var last_published	= 1345761996;
var is_shareworthy	= 0;
var url		= "senior-ok-explorer";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/senior_ok_explorer_1316414509.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/senior_ok_explorer_1316414509_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/senior_ok_explorer_1316414509_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/senior_ok_explorer_1316414509_40.png";
function on_apply(pc){
	pc.quests_offer('explore_the_seams');
}
var conditions = {
	4 : {
		type	: "group_count",
		group	: "locations_visited",
		value	: "23"
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(20 * multiplier));
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
		"giant"		: "lem",
		"points"	: 20
	}
};

//log.info("senior_ok_explorer.js LOADED");

// generated ok (NO DATE)
