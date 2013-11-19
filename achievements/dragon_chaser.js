var name		= "Dragon Chaser";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Kept up No-No Rush for 11 minutes";
var status_text		= "Who knew you could keep a No-No Rush going for 11 minutes? This Dragon Chaser Badge will earn you the respect, if not the admiration, of your peers.";
var last_published	= 1348797688;
var is_shareworthy	= 1;
var url		= "dragon-chaser";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-08-10\/dragon_chaser_1313024461.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-08-10\/dragon_chaser_1313024461_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-08-10\/dragon_chaser_1313024461_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-08-10\/dragon_chaser_1313024461_40.png";
function on_apply(pc){
	
}
var conditions = {
	231 : {
		type	: "counter",
		group	: "powders",
		label	: "dragon_chaser",
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 100
	}
};

//log.info("dragon_chaser.js LOADED");

// generated ok (NO DATE)
