var name		= "Musicblock DG Collector";
var collection_type	= 1;
var is_secret		= 0;
var desc		= "Collected all 5 DG musicblocks";
var status_text		= "";
var last_published	= 1323933945;
var is_shareworthy	= 0;
var url		= "musicblock-dg-collector";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_musicblocks_dg_1304983639.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_musicblocks_dg_1304983639_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_musicblocks_dg_1304983639_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_musicblocks_dg_1304983639_40.png";
function on_apply(pc){
	
}
var conditions = {
	118 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_d_green_01",
		value	: "1"
	},
	119 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_d_green_02",
		value	: "1"
	},
	120 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_d_green_03",
		value	: "1"
	},
	121 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_d_green_04",
		value	: "1"
	},
	122 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_d_green_05",
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
	pc.createItemFromFamiliar("trophy_music_d_green", 1);
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
			"class_id"	: "trophy_music_d_green",
			"label"		: "DG Music Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_musicblocks_dg.js LOADED");

// generated ok (NO DATE)
