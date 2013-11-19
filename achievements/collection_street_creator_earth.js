var name		= "Street Creator Earth Trophy";
var collection_type	= 2;
var is_secret		= 0;
var desc		= "Collected all pieces of the Street Creator Earth Trophy";
var status_text		= "";
var last_published	= 1323933896;
var is_shareworthy	= 0;
var url		= "street-creator-earth-trophy";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_earth_1304985072.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_earth_1304985072_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_earth_1304985072_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_earth_1304985072_40.png";
function on_apply(pc){
	
}
var conditions = {
	402 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_earth_piece1",
		value	: "1"
	},
	403 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_earth_piece2",
		value	: "1"
	},
	404 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_earth_piece3",
		value	: "1"
	},
	405 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_earth_piece4",
		value	: "1"
	},
	406 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_earth_piece5",
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
	pc.createItemFromFamiliar("trophy_street_creator_earth", 1);
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
			"class_id"	: "trophy_street_creator_earth",
			"label"		: "Street Creator Earth Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_street_creator_earth.js LOADED");

// generated ok (NO DATE)
