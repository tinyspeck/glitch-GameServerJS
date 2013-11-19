var name		= "Supafly Flycatcher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Caught 501 perfectly perfect jars of Fireflies";
var status_text		= "Yes! 501 perfect jars of Fireflies, making you a certifiably Supafly Flycatcher. Tell all your friends.";
var last_published	= 1348802871;
var is_shareworthy	= 1;
var url		= "supafly-flycatcher";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/supafly_flycatcher_1315685974.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/supafly_flycatcher_1315685974_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/supafly_flycatcher_1315685974_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/supafly_flycatcher_1315685974_40.png";
function on_apply(pc){
	
}
var conditions = {
	512 : {
		type	: "counter",
		group	: "firefly_jar",
		label	: "full",
		value	: "501"
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(175 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 175
	}
};

//log.info("supafly_flycatcher.js LOADED");

// generated ok (NO DATE)
