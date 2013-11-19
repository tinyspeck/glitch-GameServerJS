var name		= "Candy Snaffler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Snaffled 43 Candy during Zilloween";
var status_text		= "SQUEEEEEE! FULL ON HOLIDAY SUGAR-BASED SEROTONIN RUSH FROM HOLIDAY CANDY LIKE 43 TIMES, MAN! 43 TIMES! WOOO!";
var last_published	= 1348797045;
var is_shareworthy	= 1;
var url		= "candy-snaffler";
var category		= "seasonal";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_snaffler_1319680224.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_snaffler_1319680224_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_snaffler_1319680224_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_snaffler_1319680224_40.png";
function on_apply(pc){
	
}
var conditions = {
	613 : {
		type	: "counter",
		group	: "candy_eaten",
		label	: "zilloween",
		value	: "43"
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
	pc.stats_add_favor_points("zille", round_to_5(50 * multiplier));
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
		"giant"		: "zille",
		"points"	: 50
	}
};

//log.info("candy_snaffler.js LOADED");

// generated ok (NO DATE)
