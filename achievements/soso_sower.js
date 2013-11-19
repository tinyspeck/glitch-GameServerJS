var name		= "So-So Sower";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Planted 13 Crops";
var status_text		= "You know that you can't reap without sowing. You've earned a So-So Sower badge!";
var last_published	= 1340072695;
var is_shareworthy	= 0;
var url		= "soso-sower";
var category		= "gardens";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/soso_sower_1304983819.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/soso_sower_1304983819_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/soso_sower_1304983819_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/soso_sower_1304983819_40.png";
function on_apply(pc){
	
}
var conditions = {
	183 : {
		type	: "group_sum",
		group	: "garden_plots_planted",
		value	: "13"
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
	pc.stats_add_favor_points("mab", round_to_5(15 * multiplier));
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
		"giant"		: "mab",
		"points"	: 15
	}
};

//log.info("soso_sower.js LOADED");

// generated ok (NO DATE)
