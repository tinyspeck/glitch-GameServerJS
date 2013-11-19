var name		= "Spice Collector";
var collection_type	= 1;
var is_secret		= 0;
var desc		= "Collected all 16 spices";
var status_text		= "";
var last_published	= 1323933973;
var is_shareworthy	= 0;
var url		= "spice-collector";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_spices_1304983657.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_spices_1304983657_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_spices_1304983657_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_spices_1304983657_40.png";
function on_apply(pc){
	
}
var conditions = {
	133 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "black_pepper",
		value	: "1"
	},
	134 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "camphor",
		value	: "1"
	},
	135 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "cardamom",
		value	: "1"
	},
	136 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "cinnamon",
		value	: "1"
	},
	137 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "cumin",
		value	: "1"
	},
	138 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "curry",
		value	: "1"
	},
	139 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "garlic",
		value	: "1"
	},
	140 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "ginger",
		value	: "1"
	},
	141 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "hot_pepper",
		value	: "1"
	},
	142 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "licorice",
		value	: "1"
	},
	143 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "mustard",
		value	: "1"
	},
	144 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "nutmeg",
		value	: "1"
	},
	145 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "older_spice",
		value	: "1"
	},
	146 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "pinch_of_salt",
		value	: "1"
	},
	147 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "saffron",
		value	: "1"
	},
	148 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "turmeric",
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_currants(round_to_5(100 * multiplier));
	pc.metabolics_add_mood(round_to_5(20 * multiplier));
	pc.metabolics_add_energy(round_to_5(20 * multiplier));
	pc.createItemFromFamiliar("trophy_spice", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 150,
	"currants"	: 100,
	"mood"		: 20,
	"energy"	: 20,
	"items"		: {
		"0"	: {
			"class_id"	: "trophy_spice",
			"label"		: "Spice Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_spices.js LOADED");

// generated ok (NO DATE)
