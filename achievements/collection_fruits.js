var name		= "Fruit Collector";
var collection_type	= 1;
var is_secret		= 0;
var desc		= "Collected all 12 fruit";
var status_text		= "";
var last_published	= 1323933978;
var is_shareworthy	= 0;
var url		= "fruit-collector";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_fruits_1304983663.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_fruits_1304983663_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_fruits_1304983663_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_fruits_1304983663_40.png";
function on_apply(pc){
	
}
var conditions = {
	90 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "apple",
		value	: "1"
	},
	91 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "banana",
		value	: "1"
	},
	92 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "bunch_of_grapes",
		value	: "1"
	},
	93 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "cherry",
		value	: "1"
	},
	94 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "cloudberry",
		value	: "1"
	},
	95 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "lemon",
		value	: "1"
	},
	96 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "mangosteen",
		value	: "1"
	},
	97 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "orange",
		value	: "1"
	},
	98 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "pineapple",
		value	: "1"
	},
	99 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "plum",
		value	: "1"
	},
	100 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "strawberry",
		value	: "1"
	},
	101 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "whortleberry",
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
	pc.stats_add_currants(round_to_5(75 * multiplier));
	pc.metabolics_add_mood(round_to_5(20 * multiplier));
	pc.metabolics_add_energy(round_to_5(20 * multiplier));
	pc.createItemFromFamiliar("trophy_fruit", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 150,
	"currants"	: 75,
	"mood"		: 20,
	"energy"	: 20,
	"items"		: {
		"0"	: {
			"class_id"	: "trophy_fruit",
			"label"		: "Fruit Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_fruits.js LOADED");

// generated ok (NO DATE)
