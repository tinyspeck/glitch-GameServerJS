var name		= "Loggerator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Hatchet to gently harvest Planks from Wood Trees 151 times";
var status_text		= "If we told you trees felt pain, would you feel guilty for hacking off planks from poor buggers 151 times? I mean, they don't, they love it, but would you? And if you did, would it make you feel better to know that you've achieved title of \"Loggerator\"? Well, you have!";
var last_published	= 1348801514;
var is_shareworthy	= 1;
var url		= "loggerator";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/loggerator_1315686024.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/loggerator_1315686024_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/loggerator_1315686024_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/loggerator_1315686024_40.png";
function on_apply(pc){
	
}
var conditions = {
	530 : {
		type	: "counter",
		group	: "completed_harvest",
		label	: "wood_tree",
		value	: "151"
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(75 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 75
	}
};

//log.info("loggerator.js LOADED");

// generated ok (NO DATE)
