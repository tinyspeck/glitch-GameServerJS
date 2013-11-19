var name		= "Firefly Whistling";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Swallowed a FireFlex 3000 Firefly Whistle.";
var status_text		= "You swallowed that real good and ended up with the ability to whistle whenever you need to summon some Fireflies.";
var last_published	= 1348798455;
var is_shareworthy	= 1;
var url		= "firefly-whistling";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/firefly_whistling_1304985080.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/firefly_whistling_1304985080_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/firefly_whistling_1304985080_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/firefly_whistling_1304985080_40.png";
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(5 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 5
	}
};

//log.info("firefly_whistling.js LOADED");

// generated ok (NO DATE)
