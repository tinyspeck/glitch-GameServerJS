var name		= "Occasional Gas Fancier";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 101 gaseous Vapors";
var status_text		= "Congasulations! You are now an Occasional Gas Fancier. Will you go on to harvest more gases? Or will you rest on your laurels? Or possibly someone else's laurels?";
var last_published	= 1336502657;
var is_shareworthy	= 0;
var url		= "occasional-gas-fancier";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/occasional_gas_fancier_1304984411.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/occasional_gas_fancier_1304984411_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/occasional_gas_fancier_1304984411_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/occasional_gas_fancier_1304984411_40.png";
function on_apply(pc){
	
}
var conditions = {
	288 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "general_vapour",
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

//log.info("occasional_gas_fancier.js LOADED");

// generated ok (NO DATE)
