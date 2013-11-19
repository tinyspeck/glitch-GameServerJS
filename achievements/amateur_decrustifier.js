var name		= "Amateur Decrustifier";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Expertly scraped 41 stubborn Barnacles";
var status_text		= "Sure, scraping 41 Barnacles may not require any special skill, but it does demand a gung-ho spirit and a heroic disregard for scabby knuckles. For this, you've earned the title Amateur Decrustifier.";
var last_published	= 1315936620;
var is_shareworthy	= 0;
var url		= "amateur-decrustifier";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/amateur_decrustifier_1315685944.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/amateur_decrustifier_1315685944_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/amateur_decrustifier_1315685944_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/amateur_decrustifier_1315685944_40.png";
function on_apply(pc){
	
}
var conditions = {
	500 : {
		type	: "counter",
		group	: "mortar_barnacle",
		label	: "scrape",
		value	: "41"
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 20
	}
};

//log.info("amateur_decrustifier.js LOADED");

// generated ok (NO DATE)
