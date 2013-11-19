var name		= "Knight of the Kingsguard";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Had the Crown for 5003 seconds";
var status_text		= "While others fought to get a grip, you manhandled that metal hat firmly for 5003 whole seconds. Valiant? Perhaps. Chivalous? Whatever: you've fondled the crown for 5003 seconds: that alone makes you Knight of the Kingsguard.";
var last_published	= 1348801470;
var is_shareworthy	= 1;
var url		= "knight-of-the-kingsguard";
var category		= "games";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/knight_of_the_kingsguard_1315512114.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/knight_of_the_kingsguard_1315512114_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/knight_of_the_kingsguard_1315512114_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/knight_of_the_kingsguard_1315512114_40.png";
function on_apply(pc){
	
}
var conditions = {
	583 : {
		type	: "counter",
		group	: "it_game",
		label	: "seconds_with_crown",
		value	: "5003"
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
	pc.stats_add_favor_points("friendly", round_to_5(75 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 75
	}
};

//log.info("knight_of_the_kingsguard.js LOADED");

// generated ok (NO DATE)
