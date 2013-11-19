var name		= "First Emblem of Zille";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Got your first Zille Emblem";
var status_text		= "Your lowly offerings have charmed me, young meekling. It has amused me to confer upon you 1000 favor points. Now take upon you this Emblem of Zille. Bear it wisely and well.";
var last_published	= 1323915640;
var is_shareworthy	= 0;
var url		= "first-emblem-of-zille";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_zille_emblem_1304983742.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_zille_emblem_1304983742_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_zille_emblem_1304983742_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/first_zille_emblem_1304983742_40.png";
function on_apply(pc){
	
}
var conditions = {
	169 : {
		type	: "counter",
		group	: "emblems_acquired",
		label	: "zille",
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
	pc.createItemFromFamiliar("emblem_zille", 1);
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
			"class_id"	: "emblem_zille",
			"label"		: "Emblem of Zille",
			"count"		: "1"
		}
	}
};

//log.info("first_zille_emblem.js LOADED");

// generated ok (NO DATE)
