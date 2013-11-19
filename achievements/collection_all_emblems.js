var name		= "Emblems Trophy";
var collection_type	= 1;
var is_secret		= 0;
var desc		= "Held the Emblems of all 11 Giants in your inventory at once";
var status_text		= "";
var last_published	= 1323933876;
var is_shareworthy	= 0;
var url		= "emblems-trophy";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_all_emblems_1304985076.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_all_emblems_1304985076_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_all_emblems_1304985076_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_all_emblems_1304985076_40.png";
function on_apply(pc){
	
}
var conditions = {
	407 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "emblem_alph",
		value	: "1"
	},
	408 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "emblem_cosma",
		value	: "1"
	},
	409 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "emblem_friendly",
		value	: "1"
	},
	410 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "emblem_grendaline",
		value	: "1"
	},
	411 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "emblem_humbaba",
		value	: "1"
	},
	412 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "emblem_lem",
		value	: "1"
	},
	413 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "emblem_mab",
		value	: "1"
	},
	414 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "emblem_pot",
		value	: "1"
	},
	415 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "emblem_spriggan",
		value	: "1"
	},
	416 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "emblem_ti",
		value	: "1"
	},
	417 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "emblem_zille",
		value	: "1"
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
	pc.stats_add_favor_points("all", round_to_5(30 * multiplier));
	pc.createItemFromFamiliar("trophy_emblems", 1);
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
		"giant"		: "all",
		"points"	: 30
	},
	"items"	: {
		"0"	: {
			"class_id"	: "trophy_emblems",
			"label"		: "Emblem Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_all_emblems.js LOADED");

// generated ok (NO DATE)
