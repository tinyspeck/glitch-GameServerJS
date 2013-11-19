var name		= "Inspirational Home Improver";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Chose 53 unique furniture upgrades";
var status_text		= "Never one to settle for second best, you upgraded to unique first-best furniture a total of 53 times, and never looked back. For that, you deserve a reward. Take this gorgeous badge, Inspirational Home Improver.";
var last_published	= 1348799192;
var is_shareworthy	= 1;
var url		= "inspirational-home-improver";
var category		= "furniture";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/inspirational_home_improver_1339700617.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/inspirational_home_improver_1339700617_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/inspirational_home_improver_1339700617_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/inspirational_home_improver_1339700617_40.png";
function on_apply(pc){
	
}
var conditions = {
	759 : {
		type	: "group_sum",
		group	: "upgraded",
		value	: "53"
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
	pc.stats_add_favor_points("alph", round_to_5(75 * multiplier));
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
		"giant"		: "alph",
		"points"	: 75
	}
};

//log.info("inspirational_home_improver.js LOADED");

// generated ok (NO DATE)
