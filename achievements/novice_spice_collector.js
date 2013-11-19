var name		= "Novice Spice Collector";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 101 nose-tickly Spices";
var status_text		= "Spice, they say, is the spice of life. As a Novice Spice Collector, you are now traveling a path to greater understanding of this absurd and possibly meaningless saying.";
var last_published	= 1336502696;
var is_shareworthy	= 0;
var url		= "novice-spice-collector";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/novice_spice_collector_1304984405.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/novice_spice_collector_1304984405_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/novice_spice_collector_1304984405_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/novice_spice_collector_1304984405_40.png";
function on_apply(pc){
	
}
var conditions = {
	287 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "all_spice",
		value	: "101"
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
	pc.stats_add_favor_points("spriggan", round_to_5(15 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 15
	}
};

//log.info("novice_spice_collector.js LOADED");

// generated ok (NO DATE)
