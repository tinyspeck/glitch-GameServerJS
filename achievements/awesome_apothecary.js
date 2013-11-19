var name		= "Awesome Apothecary";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Planted 1009 Herbs";
var status_text		= "What's the secret blend of herbs and spices? Well, the spiciness is you, you little firecracker, and the herbs are the 1009 that you're getting this here badge for planting.";
var last_published	= 1348796735;
var is_shareworthy	= 1;
var url		= "awesome-apothecary";
var category		= "gardens";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/awesome_apothecary_1315686148.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/awesome_apothecary_1315686148_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/awesome_apothecary_1315686148_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/awesome_apothecary_1315686148_40.png";
function on_apply(pc){
	
}
var conditions = {
	580 : {
		type	: "group_sum",
		group	: "garden_herb_plots_planted",
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 200
	}
};

//log.info("awesome_apothecary.js LOADED");

// generated ok (NO DATE)
