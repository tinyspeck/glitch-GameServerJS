var name		= "Somewhat Fly Flycatcher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Caught 73 perfectly perfect jars of Fireflies";
var status_text		= "Nice! 73 perfect jars of Fireflies is pretty impressive. And yet it still only earns you the title Somewhat Fly Flycatcher. What can I say? Flycatching is a competitive biz.";
var last_published	= 1348802852;
var is_shareworthy	= 1;
var url		= "somewhat-fly-flycatcher";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/somewhat_fly_flycatcher_1315685976.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/somewhat_fly_flycatcher_1315685976_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/somewhat_fly_flycatcher_1315685976_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/somewhat_fly_flycatcher_1315685976_40.png";
function on_apply(pc){
	
}
var conditions = {
	513 : {
		type	: "counter",
		group	: "firefly_jar",
		label	: "full",
		value	: "73"
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 60
	}
};

//log.info("somewhat_fly_flycatcher.js LOADED");

// generated ok (NO DATE)
