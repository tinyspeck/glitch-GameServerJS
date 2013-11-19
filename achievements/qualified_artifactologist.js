var name		= "Qualified Artifactologist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Reassembled ten different artifacts";
var status_text		= "You're a veritable historian, a walking museum. Ten artifacts reassembled, the secrets of the ancients are yours to unfurl, with your new shiny title and your even shinier badge.";
var last_published	= 1351302429;
var is_shareworthy	= 1;
var url		= "qualified-artifactologist";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/qualified_artifactologist_1351300719.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/qualified_artifactologist_1351300719_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/qualified_artifactologist_1351300719_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/qualified_artifactologist_1351300719_40.png";
function on_apply(pc){
	
}
var conditions = {
	853 : {
		type	: "group_count",
		group	: "artifacts_made",
		value	: "10"
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
	pc.stats_add_xp(round_to_5(4000 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(191 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 4000,
	"favor"	: {
		"giant"		: "all",
		"points"	: 191
	}
};

//log.info("qualified_artifactologist.js LOADED");

// generated ok (NO DATE)
