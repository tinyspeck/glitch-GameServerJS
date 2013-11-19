var name		= "Hobbyist Gas Fancier";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 503 gaseous Vapors";
var status_text		= "Somewhere between an Occasional Gas Fancier and a Dedicated Gas Fancier is you: a newly anointed Hobbyist Gas Fancier. Different, but not yet weird.";
var last_published	= 1336502663;
var is_shareworthy	= 0;
var url		= "hobbyist-gas-fancier";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hobbyist_gas_fancier_1304984442.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hobbyist_gas_fancier_1304984442_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hobbyist_gas_fancier_1304984442_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hobbyist_gas_fancier_1304984442_40.png";
function on_apply(pc){
	
}
var conditions = {
	294 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "general_vapour",
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

//log.info("hobbyist_gas_fancier.js LOADED");

// generated ok (NO DATE)
