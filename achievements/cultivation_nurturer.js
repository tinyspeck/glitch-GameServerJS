var name		= "Cultivation Nurturer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Nursed back to health 3 cultivation projects";
var status_text		= "When they were on their last legs, you restored 3 precious cultivation projects. Phew. And also, WOO!";
var last_published	= 1340904797;
var is_shareworthy	= 0;
var url		= "cultivation-nurturer";
var category		= "cultivation";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/cultivation_nurturer_1339717571.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/cultivation_nurturer_1339717571_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/cultivation_nurturer_1339717571_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/cultivation_nurturer_1339717571_40.png";
function on_apply(pc){
		
}
var conditions = {
	783 : {
		type	: "group_sum",
		group	: "cultivation_projects_restored",
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
	pc.stats_add_xp(round_to_5(750 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 750,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 150
	}
};

//log.info("cultivation_nurturer.js LOADED");

// generated ok (NO DATE)
