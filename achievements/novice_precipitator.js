var name		= "Novice Precipitator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Watered 7 Trees";
var status_text		= "You wield a mean watering can! You've earned a Novice Precipitator badge.";
var last_published	= 1344839111;
var is_shareworthy	= 0;
var url		= "novice-precipitator";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/novice_precipitator_1304983867.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/novice_precipitator_1304983867_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/novice_precipitator_1304983867_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/novice_precipitator_1304983867_40.png";
function on_apply(pc){
	
}
var conditions = {
	192 : {
		type	: "group_sum",
		group	: "trants_watered",
		value	: "7"
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 10
	}
};

//log.info("novice_precipitator.js LOADED");

// generated ok (NO DATE)
