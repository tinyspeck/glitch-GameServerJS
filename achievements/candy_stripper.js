var name		= "Candy Stripper";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Devoured 353 Candy during Zilloween";
var status_text		= "Who wants candy? Apparently you do, because you stripped paper from 353 Zilloween candies during the appropriate sugar-buzz season and ate them all. Somehow, only Zille knows how, you still have teeth.";
var last_published	= 1348797049;
var is_shareworthy	= 1;
var url		= "candy-stripper";
var category		= "seasonal";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_stripper_1319680234.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_stripper_1319680234_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_stripper_1319680234_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_stripper_1319680234_40.png";
function on_apply(pc){
	
}
var conditions = {
	616 : {
		type	: "counter",
		group	: "candy_eaten",
		label	: "zilloween",
		value	: "353"
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 200
	}
};

//log.info("candy_stripper.js LOADED");

// generated ok (NO DATE)
