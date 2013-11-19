var name		= "Musicblock DB Collector";
var collection_type	= 1;
var is_secret		= 0;
var desc		= "Collected all 5 DB musicblocks";
var status_text		= "";
var last_published	= 1323933938;
var is_shareworthy	= 0;
var url		= "musicblock-db-collector";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_musicblocks_db_1304983634.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_musicblocks_db_1304983634_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_musicblocks_db_1304983634_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_musicblocks_db_1304983634_40.png";
function on_apply(pc){
	
}
var conditions = {
	113 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_d_blue_01",
		value	: "1"
	},
	114 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_d_blue_02",
		value	: "1"
	},
	115 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_d_blue_03",
		value	: "1"
	},
	116 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_d_blue_04",
		value	: "1"
	},
	117 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_d_blue_05",
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
	pc.createItemFromFamiliar("trophy_music_d_blue", 1);
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
			"class_id"	: "trophy_music_d_blue",
			"label"		: "DB Music Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_musicblocks_db.js LOADED");

// generated ok (NO DATE)
