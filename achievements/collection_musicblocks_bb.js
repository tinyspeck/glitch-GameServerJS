var name		= "Musicblock BB Collector";
var collection_type	= 1;
var is_secret		= 0;
var desc		= "Collected all 5 BB musicblocks";
var status_text		= "";
var last_published	= 1323933985;
var is_shareworthy	= 0;
var url		= "musicblock-bb-collector";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-08-10\/collection_musicblocks_bb_1313024463.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-08-10\/collection_musicblocks_bb_1313024463_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-08-10\/collection_musicblocks_bb_1313024463_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-08-10\/collection_musicblocks_bb_1313024463_40.png";
function on_apply(pc){
	
}
var conditions = {
	432 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_b_brown_01",
		value	: "1"
	},
	433 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_b_brown_02",
		value	: "1"
	},
	434 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_b_brown_03",
		value	: "1"
	},
	435 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_b_brown_04",
		value	: "1"
	},
	436 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_b_brown_05",
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.metabolics_add_mood(round_to_5(200 * multiplier));
	pc.metabolics_add_energy(round_to_5(200 * multiplier));
	pc.createItemFromFamiliar("trophy_music_b_brown", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 500,
	"mood"		: 200,
	"energy"	: 200,
	"items"		: {
		"0"	: {
			"class_id"	: "trophy_music_b_brown",
			"label"		: "BB Music Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_musicblocks_bb.js LOADED");

// generated ok (NO DATE)
