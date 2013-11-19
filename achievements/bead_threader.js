var name		= "Bead Threader";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Carefully reconstructed one ancient artifact necklace";
var status_text		= "Bead by bead, you reassembled one of the necklaces of the ancients. Pretty! Pretty AND badgeworthy!";
var last_published	= 1351302504;
var is_shareworthy	= 1;
var url		= "bead-threader";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/bead_threader_1351302325.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/bead_threader_1351302325_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/bead_threader_1351302325_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/bead_threader_1351302325_40.png";
function on_apply(pc){
	
}
var conditions = {
	854 : {
		type	: "group_count",
		group	: "necklaces_made",
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("cosma", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "cosma",
		"points"	: 100
	}
};

//log.info("bead_threader.js LOADED");

// generated ok (NO DATE)
