var name		= "Egg Hunter Trophy";
var collection_type	= 2;
var is_secret		= 0;
var desc		= "Collected all 5 Chocolate Eggs";
var status_text		= "Your enthusiasm for Egg collection has been acknowledged! You've more than earned this stylish, but inedible Egg Hunter Trophy.";
var last_published	= 1323933874;
var is_shareworthy	= 0;
var url		= "egg-hunter-trophy";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_egg_hunter_1304985099.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_egg_hunter_1304985099_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_egg_hunter_1304985099_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_egg_hunter_1304985099_40.png";
function on_apply(pc){
	
}
var conditions = {
	426 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "egghunt_egg_1",
		value	: "1"
	},
	427 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "egghunt_egg_2",
		value	: "1"
	},
	428 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "egghunt_egg_3",
		value	: "1"
	},
	429 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "egghunt_egg_4",
		value	: "1"
	},
	430 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "egghunt_egg_5",
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_currants(round_to_5(250 * multiplier));
	pc.metabolics_add_mood(round_to_5(100 * multiplier));
	pc.metabolics_add_energy(round_to_5(100 * multiplier));
	pc.createItemFromFamiliar("trophy_egghunt", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 250,
	"currants"	: 250,
	"mood"		: 100,
	"energy"	: 100,
	"items"		: {
		"0"	: {
			"class_id"	: "trophy_egghunt",
			"label"		: "Egg Hunter Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_egg_hunter.js LOADED");

// generated ok (NO DATE)
