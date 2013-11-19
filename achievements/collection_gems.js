var name		= "Gem Collector";
var collection_type	= 1;
var is_secret		= 0;
var desc		= "Collected all 5 rare gems";
var status_text		= "Oooooo, shiny!";
var last_published	= 1323933920;
var is_shareworthy	= 0;
var url		= "gem-collector";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_gems_1304983624.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_gems_1304983624_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_gems_1304983624_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_gems_1304983624_40.png";
function on_apply(pc){
	
}
var conditions = {
	108 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "gem_amber",
		value	: "1"
	},
	109 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "gem_diamond",
		value	: "1"
	},
	110 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "gem_moonstone",
		value	: "1"
	},
	111 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "gem_ruby",
		value	: "1"
	},
	112 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "gem_sapphire",
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
	pc.metabolics_add_mood(round_to_5(250 * multiplier));
	pc.metabolics_add_energy(round_to_5(250 * multiplier));
	pc.createItemFromFamiliar("trophy_gem", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 500,
	"mood"		: 250,
	"energy"	: 250,
	"items"		: {
		"0"	: {
			"class_id"	: "trophy_gem",
			"label"		: "Gem Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_gems.js LOADED");

// generated ok (NO DATE)
