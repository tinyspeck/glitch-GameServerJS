var name		= "Stalker, Non-Creepy Designation";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Officially followed another player through 3 different streets";
var status_text		= "Following other people is the sort of behaviour that has been known to get people socked, or at the very least glared at. But in this case you get the special title of Stalker, Non-Creepy Designation.";
var last_published	= 1348802866;
var is_shareworthy	= 1;
var url		= "stalker-noncreepy-designation";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/stalker_noncreepy_designation_1304984896.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/stalker_noncreepy_designation_1304984896_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/stalker_noncreepy_designation_1304984896_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/stalker_noncreepy_designation_1304984896_40.png";
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
	pc.stats_add_favor_points("friendly", round_to_5(25 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 25
	}
};

//log.info("stalker_noncreepy_designation.js LOADED");

// generated ok (NO DATE)
