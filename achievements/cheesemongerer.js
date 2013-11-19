var name		= "Cheesemongerer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Unlocked the mystery of turning ordinary butterfly milk into cheese";
var status_text		= "You've discovered the key to cheese alchemy! You are hereby awarded the title of Cheesemongerer.";
var last_published	= 1349313865;
var is_shareworthy	= 1;
var url		= "cheesemongerer";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/cheesemongerer_1304983796.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/cheesemongerer_1304983796_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/cheesemongerer_1304983796_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/cheesemongerer_1304983796_40.png";
function on_apply(pc){
	
}
var conditions = {
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
	pc.stats_add_favor_points("pot", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 75,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 10
	}
};

//log.info("cheesemongerer.js LOADED");

// generated ok (NO DATE)
