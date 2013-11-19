var name		= "Street Creator Rock Trophy";
var collection_type	= 2;
var is_secret		= 0;
var desc		= "Collected all pieces of the Street Creator Rock Trophy";
var status_text		= "";
var last_published	= 1323933890;
var is_shareworthy	= 0;
var url		= "street-creator-rock-trophy";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_rock_1304985068.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_rock_1304985068_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_rock_1304985068_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_street_creator_rock_1304985068_40.png";
function on_apply(pc){
	
}
var conditions = {
	397 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_rock_piece1",
		value	: "1"
	},
	398 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_rock_piece2",
		value	: "1"
	},
	399 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_rock_piece3",
		value	: "1"
	},
	400 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_rock_piece4",
		value	: "1"
	},
	401 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "trophy_street_creator_rock_piece5",
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
	pc.createItemFromFamiliar("trophy_street_creator_rock", 1);
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
			"class_id"	: "trophy_street_creator_rock",
			"label"		: "Street Creator Rock Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_street_creator_rock.js LOADED");

// generated ok (NO DATE)
