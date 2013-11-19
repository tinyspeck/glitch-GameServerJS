var name		= "Potionographer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Quaffed or poured 811 Potions";
var status_text		= "What was the world like before you discovered Potions? Who knows? What's more, who cares?!? Potions are awesome. Ergo, 811 Potions are the Eight-hundred-and-eleventy-awesomenest! ZING!";
var last_published	= 1348802245;
var is_shareworthy	= 1;
var url		= "potionographer";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/potionographer_1322093730.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/potionographer_1322093730_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/potionographer_1322093730_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/potionographer_1322093730_40.png";
function on_apply(pc){
	
}
var conditions = {
	661 : {
		type	: "group_sum",
		group	: "potions_used",
		value	: "811"
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
	pc.stats_add_xp(round_to_5(1250 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(250 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1250,
	"favor"	: {
		"giant"		: "ti",
		"points"	: 250
	}
};

//log.info("potionographer.js LOADED");

// generated ok (NO DATE)
