var name		= "Affable Anthony";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Popped round to 101 different home streets";
var status_text		= "You've either got a lot of close friends, or just like wandering through other people's front yards. Whichever way, you've just earned yourself a badge for it. You go, Affable Anthony.";
var last_published	= 1348796071;
var is_shareworthy	= 1;
var url		= "affable-anthony";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-28\/affable_anthony_1340931597.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-28\/affable_anthony_1340931597_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-28\/affable_anthony_1340931597_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-28\/affable_anthony_1340931597_40.png";
function on_apply(pc){
	
}
var conditions = {
	779 : {
		type	: "group_count",
		group	: "player_streets_visited",
		value	: "101"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 100
	}
};

//log.info("affable_anthony.js LOADED");

// generated ok (NO DATE)
