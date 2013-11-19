var name		= "Better Bubble Farmer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Ever-so-carefully harvested 503 Bubbles";
var status_text		= "You've been initiated into the secret order of Better Bubble Farmers. Consider their motto: 'Sometimes you eat the bubble, and sometimes the bubble eats you.' Nobody knows if this has ever actually meant anything.";
var last_published	= 1336502587;
var is_shareworthy	= 0;
var url		= "better-bubble-farmer";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/better_bubble_farmer_1304984426.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/better_bubble_farmer_1304984426_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/better_bubble_farmer_1304984426_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/better_bubble_farmer_1304984426_40.png";
function on_apply(pc){
	
}
var conditions = {
	291 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "plain_bubble",
		value	: "503"
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
	pc.stats_add_favor_points("spriggan", round_to_5(40 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 40
	}
};

//log.info("better_bubble_farmer.js LOADED");

// generated ok (NO DATE)
