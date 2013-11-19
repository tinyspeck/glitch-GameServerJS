var name		= "Dedicated Gas Fancier";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 1009 gaseous Vapors";
var status_text		= "Your dedication, your fancy for gas, and dedicated gas harvesting in a fancy kind of way has reached the level of Dedicated Gas Fancier, which is both admirable, and somewhat expected. Still: fancy!";
var last_published	= 1349461063;
var is_shareworthy	= 1;
var url		= "dedicated-gas-fancier";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/dedicated_gas_fancier_1304984477.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/dedicated_gas_fancier_1304984477_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/dedicated_gas_fancier_1304984477_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/dedicated_gas_fancier_1304984477_40.png";
function on_apply(pc){
	
}
var conditions = {
	300 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "general_vapour",
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

//log.info("dedicated_gas_fancier.js LOADED");

// generated ok (NO DATE)
