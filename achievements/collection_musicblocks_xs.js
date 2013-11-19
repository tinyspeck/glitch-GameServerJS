var name		= "Musicblock XS Collector";
var collection_type	= 1;
var is_secret		= 0;
var desc		= "Collected all 5 XS musicblocks";
var status_text		= "";
var last_published	= 1323933959;
var is_shareworthy	= 0;
var url		= "musicblock-xs-collector";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_musicblocks_xs_1304983647.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_musicblocks_xs_1304983647_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_musicblocks_xs_1304983647_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_musicblocks_xs_1304983647_40.png";
function on_apply(pc){
	
}
var conditions = {
	128 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_x_shiny_01",
		value	: "1"
	},
	129 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_x_shiny_02",
		value	: "1"
	},
	130 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_x_shiny_03",
		value	: "1"
	},
	131 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_x_shiny_04",
		value	: "1"
	},
	132 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "musicblock_x_shiny_05",
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	pc.metabolics_add_mood(round_to_5(250 * multiplier));
	pc.metabolics_add_energy(round_to_5(250 * multiplier));
	pc.createItemFromFamiliar("trophy_music_x_shiny", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 800,
	"mood"		: 250,
	"energy"	: 250,
	"items"		: {
		"0"	: {
			"class_id"	: "trophy_music_x_shiny",
			"label"		: "XS Music Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_musicblocks_xs.js LOADED");

// generated ok (NO DATE)
