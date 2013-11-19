var name		= "Gas Collector";
var collection_type	= 1;
var is_secret		= 0;
var desc		= "Collected all 6 gasses";
var status_text		= "";
var last_published	= 1323933966;
var is_shareworthy	= 0;
var url		= "gas-collector";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_gasses_1304983652.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_gasses_1304983652_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_gasses_1304983652_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_gasses_1304983652_40.png";
function on_apply(pc){
	
}
var conditions = {
	102 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "crying_gas",
		value	: "1"
	},
	103 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "general_vapour",
		value	: "1"
	},
	104 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "heavy_gas",
		value	: "1"
	},
	105 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "helium",
		value	: "1"
	},
	106 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "laughing_gas",
		value	: "1"
	},
	107 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "white_gas",
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_currants(round_to_5(100 * multiplier));
	pc.metabolics_add_mood(round_to_5(20 * multiplier));
	pc.metabolics_add_energy(round_to_5(20 * multiplier));
	pc.createItemFromFamiliar("trophy_gas", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 100,
	"currants"	: 100,
	"mood"		: 20,
	"energy"	: 20,
	"items"		: {
		"0"	: {
			"class_id"	: "trophy_gas",
			"label"		: "Gas Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_gasses.js LOADED");

// generated ok (NO DATE)
