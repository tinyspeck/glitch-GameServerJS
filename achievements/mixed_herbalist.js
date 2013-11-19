var name		= "Mixed Herbalist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Planted 37 Herbs";
var status_text		= "Oh Herby Day! You've sown 37 precious herby bundles. A badge for all your hoe-ed work.";
var last_published	= 1323914880;
var is_shareworthy	= 0;
var url		= "mixed-herbalist";
var category		= "gardens";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/mixed_herbalist_1315686144.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/mixed_herbalist_1315686144_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/mixed_herbalist_1315686144_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/mixed_herbalist_1315686144_40.png";
function on_apply(pc){
	
}
var conditions = {
	577 : {
		type	: "group_sum",
		group	: "garden_herb_plots_planted",
		value	: "37"
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
	pc.stats_add_xp(round_to_5(350 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(45 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 350,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 45
	}
};

//log.info("mixed_herbalist.js LOADED");

// generated ok (NO DATE)
