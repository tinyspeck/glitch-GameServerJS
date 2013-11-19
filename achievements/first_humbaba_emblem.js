var name		= "First Emblem of Humbaba";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Got your first Humbaba Emblem";
var status_text		= "Oho, young seeker. For your persistent efforts to accrue 1000 favor points, I now reward you with... more favor. This time it is in the form of an Emblem of Humbaba. Cherish it.";
var last_published	= 1323915611;
var is_shareworthy	= 0;
var url		= "first-emblem-of-humbaba";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_humbaba_emblem_1304983711.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_humbaba_emblem_1304983711_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_humbaba_emblem_1304983711_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_humbaba_emblem_1304983711_40.png";
function on_apply(pc){
	
}
var conditions = {
	163 : {
		type	: "counter",
		group	: "emblems_acquired",
		label	: "humbaba",
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
	pc.createItemFromFamiliar("emblem_humbaba", 1);
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
			"class_id"	: "emblem_humbaba",
			"label"		: "Emblem of Humbaba",
			"count"		: "1"
		}
	}
};

//log.info("first_humbaba_emblem.js LOADED");

// generated ok (NO DATE)
