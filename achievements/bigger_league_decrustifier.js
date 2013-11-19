var name		= "Bigger League Decrustifier";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Expertly scraped 1009 stubborn Barnacles";
var status_text		= "Just when you thought the big league of Barnacle scraping couldn't get any bigger, it went and did. You know what this makes you, of course? Yes. A Bigger League Decrustifier.";
var last_published	= 1348796794;
var is_shareworthy	= 1;
var url		= "bigger-league-decrustifier";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/bigger_league_decrustifier_1315685954.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/bigger_league_decrustifier_1315685954_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/bigger_league_decrustifier_1315685954_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/bigger_league_decrustifier_1315685954_40.png";
function on_apply(pc){
	
}
var conditions = {
	504 : {
		type	: "counter",
		group	: "mortar_barnacle",
		label	: "scrape",
		value	: "1009"
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
	pc.stats_add_favor_points("mab", round_to_5(175 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 175
	}
};

//log.info("bigger_league_decrustifier.js LOADED");

// generated ok (NO DATE)
