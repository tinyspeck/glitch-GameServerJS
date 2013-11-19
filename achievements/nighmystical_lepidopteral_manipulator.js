var name		= "Nigh-Mystical Lepidopteral Manipulator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Administered 503 borderline magical Butterfly massages";
var status_text		= "Long have the Butterflies whispered of One who would administer 503 mystical massages. Lo! It probably isn't you, but you at least deserve the title Nigh-Mystical Lepidopteral Manipulator. Verily!";
var last_published	= 1348801929;
var is_shareworthy	= 1;
var url		= "nighmystical-lepidopteral-manipulator";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/nighmystical_lepidopteral_manipulator_1304984127.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/nighmystical_lepidopteral_manipulator_1304984127_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/nighmystical_lepidopteral_manipulator_1304984127_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/nighmystical_lepidopteral_manipulator_1304984127_40.png";
function on_apply(pc){
	
}
var conditions = {
	239 : {
		type	: "counter",
		group	: "npc_butterfly",
		label	: "massage",
		value	: "503"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 150
	}
};

//log.info("nighmystical_lepidopteral_manipulator.js LOADED");

// generated ok (NO DATE)
