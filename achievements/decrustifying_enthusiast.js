var name		= "Decrustifying Enthusiast";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Expertly scraped 127 stubborn Barnacles";
var status_text		= "When it comes to scraping Barnacles, what you lack in polish, you make up for in good old-fashioned Barnacle-scraping zeal. You've just won your own self the title Decrustifying Enthusiast.";
var last_published	= 1348797437;
var is_shareworthy	= 1;
var url		= "decrustifying-enthusiast";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/decrustifying_enthusiast_1315685946.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/decrustifying_enthusiast_1315685946_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/decrustifying_enthusiast_1315685946_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/decrustifying_enthusiast_1315685946_40.png";
function on_apply(pc){
	
}
var conditions = {
	501 : {
		type	: "counter",
		group	: "mortar_barnacle",
		label	: "scrape",
		value	: "127"
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
	pc.stats_add_xp(round_to_5(350 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(45 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 350,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 45
	}
};

//log.info("decrustifying_enthusiast.js LOADED");

// generated ok (NO DATE)
