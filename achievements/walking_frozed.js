var name		= "The Walking Frozed";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "Froze your brain 11 times";
var status_text		= "Some say you can't bring frozen matter back to life. You're proving them wrong with every step you take: your brain has been frozen 11 times and flickered back to life every time. You're a medical miracle, a freak of nature: you're The Walking Frozed. Yay!";
var last_published	= 1351647803;
var is_shareworthy	= 1;
var url		= "walking-frozed";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/walking_frozed_1351618943.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/walking_frozed_1351618943_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/walking_frozed_1351618943_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/walking_frozed_1351618943_40.png";
function on_apply(pc){
	
}
var conditions = {
	864 : {
		type	: "counter",
		group	: "brain",
		label	: "frozen",
		value	: "11"
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
	pc.stats_add_xp(round_to_5(333 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(66 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 333,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 66
	}
};

//log.info("walking_frozed.js LOADED");

// generated ok (NO DATE)
