var name		= "First Emblem of Lem";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Got your first Lem Emblem";
var status_text		= "The depth of your obsequiousness is matched only by the depth of your pockets. For accumulating 1000 favor points, you are now entitled to receive one shiny Emblem of Lem.";
var last_published	= 1323915616;
var is_shareworthy	= 0;
var url		= "first-emblem-of-lem";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_lem_emblem_1304983716.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_lem_emblem_1304983716_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_lem_emblem_1304983716_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_lem_emblem_1304983716_40.png";
function on_apply(pc){
	
}
var conditions = {
	164 : {
		type	: "counter",
		group	: "emblems_acquired",
		label	: "lem",
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
	pc.createItemFromFamiliar("emblem_lem", 1);
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
			"class_id"	: "emblem_lem",
			"label"		: "Emblem of Lem",
			"count"		: "1"
		}
	}
};

//log.info("first_lem_emblem.js LOADED");

// generated ok (NO DATE)
