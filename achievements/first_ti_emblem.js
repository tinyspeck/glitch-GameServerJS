var name		= "First Emblem of Tii";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Got your first Tii Emblem";
var status_text		= "I have tallied your oblations, large and small, tiny one. You have earned 1000 favor points and thus, a spark of my favor. Take this Emblem of Ti in humility.";
var last_published	= 1323915635;
var is_shareworthy	= 0;
var url		= "first-emblem-of-tii";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_ti_emblem_1304983737.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_ti_emblem_1304983737_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_ti_emblem_1304983737_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_ti_emblem_1304983737_40.png";
function on_apply(pc){
	
}
var conditions = {
	168 : {
		type	: "counter",
		group	: "emblems_acquired",
		label	: "ti",
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
	pc.createItemFromFamiliar("emblem_ti", 1);
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
			"class_id"	: "emblem_ti",
			"label"		: "Emblem of Tii",
			"count"		: "1"
		}
	}
};

//log.info("first_ti_emblem.js LOADED");

// generated ok (NO DATE)
