var name		= "Quiet Tragedy";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Croaked in your own home";
var status_text		= "You died, perished, you located a bucket and kicked it. You ceased to be. You carked it, you shuffled off your mortal coil. And you did it all in the comfort of your own home. A Quiet Tragedy, but it's all ok now, right? Chin up: Have a badge.";
var last_published	= 1348802280;
var is_shareworthy	= 1;
var url		= "quiet-tragedy";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/quiet_tragedy_1339717776.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/quiet_tragedy_1339717776_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/quiet_tragedy_1339717776_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/quiet_tragedy_1339717776_40.png";
function on_apply(pc){
	
}
var conditions = {
	772 : {
		type	: "counter",
		group	: "croaked",
		label	: "at_home",
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(50 * multiplier));
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
		"points"	: 50
	}
};

//log.info("quiet_tragedy.js LOADED");

// generated ok (NO DATE)
