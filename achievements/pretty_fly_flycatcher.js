var name		= "Pretty Fly Flycatcher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Caught 147 perfectly perfect jars of Fireflies";
var status_text		= "Oh yeah, that's the stuff. 147 perfect jars of Fireflies. You are a Pretty Fly Flycatcher. And yet, don't you think you could still be flyer?";
var last_published	= 1348802257;
var is_shareworthy	= 1;
var url		= "pretty-fly-flycatcher";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/pretty_fly_flycatcher_1315685969.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/pretty_fly_flycatcher_1315685969_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/pretty_fly_flycatcher_1315685969_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/pretty_fly_flycatcher_1315685969_40.png";
function on_apply(pc){
	
}
var conditions = {
	510 : {
		type	: "counter",
		group	: "firefly_jar",
		label	: "full",
		value	: "147"
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
	pc.stats_add_favor_points("mab", round_to_5(100 * multiplier));
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
		"giant"		: "mab",
		"points"	: 100
	}
};

//log.info("pretty_fly_flycatcher.js LOADED");

// generated ok (NO DATE)
