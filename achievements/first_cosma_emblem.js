var name		= "First Emblem of Cosma";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Got your first Cosma Emblem";
var status_text		= "Humble Glitchling, your petitions have pleased me greatly. Or at least they have not displeased me greatly. Either way, as a reward for obtaining 1000 favor points, I confer upon you the noble Emblem of Cosma.";
var last_published	= 1323915595;
var is_shareworthy	= 0;
var url		= "first-emblem-of-cosma";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_cosma_emblem_1304983695.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_cosma_emblem_1304983695_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_cosma_emblem_1304983695_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_cosma_emblem_1304983695_40.png";
function on_apply(pc){
	
}
var conditions = {
	160 : {
		type	: "counter",
		group	: "emblems_acquired",
		label	: "cosma",
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
	pc.stats_add_xp(round_to_5(75 * multiplier), true);
	pc.createItemFromFamiliar("emblem_cosma", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 75,
	"items"	: {
		"0"	: {
			"class_id"	: "emblem_cosma",
			"label"		: "Emblem of Cosma",
			"count"		: "1"
		}
	}
};

//log.info("first_cosma_emblem.js LOADED");

// generated ok (NO DATE)
