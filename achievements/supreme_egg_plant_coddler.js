var name		= "Supreme Egg Plant Coddler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Administered life-sustaining pettings to 41 Egg Plants";
var status_text		= "You have a nice technique for petting. Firm, yet gentle as a Butterfly handshake. You deserve the title Supreme Egg Plant Coddler.";
var last_published	= 1348802897;
var is_shareworthy	= 1;
var url		= "supreme-egg-plant-coddler";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/supreme_egg_plant_coddler_1304984565.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/supreme_egg_plant_coddler_1304984565_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/supreme_egg_plant_coddler_1304984565_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/supreme_egg_plant_coddler_1304984565_40.png";
function on_apply(pc){
	
}
var conditions = {
	316 : {
		type	: "counter",
		group	: "trants_petted",
		label	: "trant_egg",
		value	: "41"
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
	pc.stats_add_favor_points("grendaline", round_to_5(40 * multiplier));
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
		"giant"		: "grendaline",
		"points"	: 40
	}
};

//log.info("supreme_egg_plant_coddler.js LOADED");

// generated ok (NO DATE)
