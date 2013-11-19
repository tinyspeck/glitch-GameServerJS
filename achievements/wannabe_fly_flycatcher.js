var name		= "Wannabe Fly Flycatcher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Caught 23 perfectly perfect jars of Fireflies";
var status_text		= "While 23 perfect jars of Fireflies is a fairly decent achievement, it still only earns you the Wannabe Fly Flycatcher badge. Sorry about that.";
var last_published	= 1338921015;
var is_shareworthy	= 0;
var url		= "wannabe-fly-flycatcher";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/wannabe_fly_flycatcher_1315685972.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/wannabe_fly_flycatcher_1315685972_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/wannabe_fly_flycatcher_1315685972_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/wannabe_fly_flycatcher_1315685972_40.png";
function on_apply(pc){
	
}
var conditions = {
	511 : {
		type	: "counter",
		group	: "firefly_jar",
		label	: "full",
		value	: "23"
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 40
	}
};

//log.info("wannabe_fly_flycatcher.js LOADED");

// generated ok (NO DATE)
