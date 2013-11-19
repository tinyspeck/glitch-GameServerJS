var name		= "Student of Artifactology";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Reassembled three different artifacts";
var status_text		= "The memories of the ancients buzz through you as you handle artifacts. Having carefully reassembled three, hopefully it hasn't given you a headache. It has, however, given you a badge. YAY!";
var last_published	= 1351302421;
var is_shareworthy	= 1;
var url		= "student-of-artifactology";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/student_of_artifactology_1351300716.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/student_of_artifactology_1351300716_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/student_of_artifactology_1351300716_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/student_of_artifactology_1351300716_40.png";
function on_apply(pc){
	
}
var conditions = {
	852 : {
		type	: "group_count",
		group	: "artifacts_made",
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
	pc.stats_add_xp(round_to_5(1750 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(87 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1750,
	"favor"	: {
		"giant"		: "all",
		"points"	: 87
	}
};

//log.info("student_of_artifactology.js LOADED");

// generated ok (NO DATE)
