var name		= "Hi Velocity";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Eluded a Hi Sign for 151 seconds";
var status_text		= "If anyone wants to say hi to you, they'd better be quick about it: you're one Hi Velocity glitch, too speedy for casual salutations. You can avoid a Hi Sign for 151 seconds, after all. Antisocial? No! Superfast!";
var last_published	= 1351812826;
var is_shareworthy	= 1;
var url		= "hi-velocity";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_as_a_kite_1351811570.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_as_a_kite_1351811570_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_as_a_kite_1351811570_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_as_a_kite_1351811570_40.png";
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(75 * multiplier));
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
		"giant"		: "lem",
		"points"	: 75
	}
};

//log.info("hi_as_a_kite.js LOADED");

// generated ok (NO DATE)
