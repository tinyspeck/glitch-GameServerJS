var name		= "The Motorboat";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Outwitted a Hi Sign for 311 seconds";
var status_text		= "You were like two ships that passed in the night. But while the Hi Sign was some kind of tiny friendly freighter, you were some kind of crazy hi-speed motorboat eschewing that happy greeting for 311 seconds. Go you!";
var last_published	= 1351812835;
var is_shareworthy	= 1;
var url		= "the-motorboat";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_velocity_1351811573.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_velocity_1351811573_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_velocity_1351811573_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_velocity_1351811573_40.png";
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
	pc.stats_add_xp(round_to_5(750 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(120 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 750,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 120
	}
};

//log.info("hi_velocity.js LOADED");

// generated ok (NO DATE)
