var name		= "Amateur Agronomist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Planted 53 Crops";
var status_text		= "Congratulations! Beyond a seed of doubt, you've earned an Amateur Agronomist badge.";
var last_published	= 1340072703;
var is_shareworthy	= 0;
var url		= "amateur-agronomist";
var category		= "gardens";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/amateur_agronomist_1304983824.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/amateur_agronomist_1304983824_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/amateur_agronomist_1304983824_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/amateur_agronomist_1304983824_40.png";
function on_apply(pc){
	
}
var conditions = {
	184 : {
		type	: "group_sum",
		group	: "garden_plots_planted",
		value	: "53"
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
	pc.stats_add_favor_points("mab", round_to_5(40 * multiplier));
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
		"giant"		: "mab",
		"points"	: 40
	}
};

//log.info("amateur_agronomist.js LOADED");

// generated ok (NO DATE)
