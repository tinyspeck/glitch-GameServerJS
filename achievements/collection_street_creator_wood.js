var name		= "Street Creator Wood Trophy";
var collection_type	= 2;
var is_secret		= 0;
var desc		= "Collected all pieces of the Street Creator Wood Trophy";
var status_text		= "";
var last_published	= 1323933884;
var is_shareworthy	= 0;
var url		= "street-creator-wood-trophy";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_wood_1304985061.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_wood_1304985061_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_wood_1304985061_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_wood_1304985061_40.png";
function on_apply(pc){
	
}
var conditions = {
	392 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_wood_piece1",
		value	: "1"
	},
	393 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_wood_piece2",
		value	: "1"
	},
	394 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_wood_piece3",
		value	: "1"
	},
	395 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_wood_piece4",
		value	: "1"
	},
	396 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_wood_piece5",
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
	pc.createItemFromFamiliar("trophy_street_creator_wood", 1);
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
			"class_id"	: "trophy_street_creator_wood",
			"label"		: "Street Creator Wood Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_street_creator_wood.js LOADED");

// generated ok (NO DATE)
