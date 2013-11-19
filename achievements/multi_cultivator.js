var name		= "Multi Cultivator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Planted 503 Herbs";
var status_text		= "Without you, there'd be 503 less clusters of herbs in this world. And without those 503 herby clusters, you'd be without this badge. See? Everyone's a winner.";
var last_published	= 1348801910;
var is_shareworthy	= 1;
var url		= "multi-cultivator";
var category		= "gardens";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/multi_cultivator_1315686146.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/multi_cultivator_1315686146_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/multi_cultivator_1315686146_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/multi_cultivator_1315686146_40.png";
function on_apply(pc){
	
}
var conditions = {
	579 : {
		type	: "group_sum",
		group	: "garden_herb_plots_planted",
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
	pc.stats_add_favor_points("mab", round_to_5(150 * multiplier));
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
		"giant"		: "mab",
		"points"	: 150
	}
};

//log.info("multi_cultivator.js LOADED");

// generated ok (NO DATE)
