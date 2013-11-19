var name		= "Intermediate Spice Collector";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 503 nostril-pleasing Spices";
var status_text		= "You've harvested 503 nostril-pleasing Spices, thereby earning yourself an Intermediate Spice Collector badge, which is, ironically, a collector's item in and of itself.";
var last_published	= 1348801438;
var is_shareworthy	= 1;
var url		= "intermediate-spice-collector";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/intermediate_spice_collector_1304984436.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/intermediate_spice_collector_1304984436_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/intermediate_spice_collector_1304984436_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/intermediate_spice_collector_1304984436_40.png";
function on_apply(pc){
	
}
var conditions = {
	293 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "all_spice",
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 40
	}
};

//log.info("intermediate_spice_collector.js LOADED");

// generated ok (NO DATE)
