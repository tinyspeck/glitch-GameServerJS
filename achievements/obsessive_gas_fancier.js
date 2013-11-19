var name		= "Obsessive Gas Fancier";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 5003 gaseous Vapors";
var status_text		= "After harvesting 5003 Vapors, clearly you're into Gas. Maybe more than would be considered normal. But hey, no judging here. Nope. You go ahead and enjoy this Obsessive Gas Fancier badge.";
var last_published	= 1348801961;
var is_shareworthy	= 1;
var url		= "obsessive-gas-fancier";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/obsessive_gas_fancier_1304984512.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/obsessive_gas_fancier_1304984512_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/obsessive_gas_fancier_1304984512_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/obsessive_gas_fancier_1304984512_40.png";
function on_apply(pc){
	
}
var conditions = {
	306 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "general_vapour",
		value	: "5003"
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
	pc.stats_add_favor_points("spriggan", round_to_5(150 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 150
	}
};

//log.info("obsessive_gas_fancier.js LOADED");

// generated ok (NO DATE)
