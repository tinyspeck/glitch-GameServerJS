var name		= "Advanced Spice Collector";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 1009 odoriferant Spices";
var status_text		= "You've braved Tickly Nose Syndrome to harvest 1009 odoriferant Spices. By all accounts, you are now an Advanced Spice Collector.";
var last_published	= 1348796065;
var is_shareworthy	= 1;
var url		= "advanced-spice-collector";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/advanced_spice_collector_1304984471.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/advanced_spice_collector_1304984471_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/advanced_spice_collector_1304984471_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/advanced_spice_collector_1304984471_40.png";
function on_apply(pc){
	
}
var conditions = {
	299 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "all_spice",
		value	: "1009"
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 60
	}
};

//log.info("advanced_spice_collector.js LOADED");

// generated ok (NO DATE)
