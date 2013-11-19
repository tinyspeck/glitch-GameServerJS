var name		= "Semi-Pro Decrustifier";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Expertly scraped 283 stubborn Barnacles";
var status_text		= "For dislodging 283 troublesome Barnacles for the purpose of putting them to good use for once in their sorry lives, you've earned the title Semi-Pro Decrustifier.";
var last_published	= 1348802522;
var is_shareworthy	= 1;
var url		= "semi-pro-decrustifier";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/semi_pro_decrustifier_1315685949.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/semi_pro_decrustifier_1315685949_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/semi_pro_decrustifier_1315685949_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/semi_pro_decrustifier_1315685949_40.png";
function on_apply(pc){
	
}
var conditions = {
	502 : {
		type	: "counter",
		group	: "mortar_barnacle",
		label	: "scrape",
		value	: "283"
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
	pc.stats_add_favor_points("mab", round_to_5(75 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 75
	}
};

//log.info("semi_pro_decrustifier.js LOADED");

// generated ok (NO DATE)
