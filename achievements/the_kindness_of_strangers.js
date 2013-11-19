var name		= "The Kindness of Strangers";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Received more than 2503 iMG per day in a Daily Stipend";
var status_text		= "Enough mining, whistling, harvesting, scooping was done on your home street to net you 2503 iMG *and* this badge. There you go! You really CAN depend on the kindness of strangers.";
var last_published	= 1348802924;
var is_shareworthy	= 1;
var url		= "the-kindness-of-strangers";
var category		= "cultivation";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/the_kindness_of_strangers_1339702874.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/the_kindness_of_strangers_1339702874_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/the_kindness_of_strangers_1339702874_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/the_kindness_of_strangers_1339702874_40.png";
function on_apply(pc){
	
}
var conditions = {
	775 : {
		type	: "counter",
		group	: "daily_img",
		label	: "twenty_five_hundred_three",
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
	pc.stats_add_xp(round_to_5(1750 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(275 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1750,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 275
	}
};

//log.info("the_kindness_of_strangers.js LOADED");

// generated ok (NO DATE)
