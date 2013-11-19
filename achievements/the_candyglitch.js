var name		= "The Candyglitch";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gave Candy to 499 Lucky Candy-Lickers during Zilloween";
var status_text		= "Who can take a sunrise, sprinkle it with dew, cover it in chocolate and a miracle or two? The Candyglitch can! That's you! YAY!";
var last_published	= 1348802906;
var is_shareworthy	= 1;
var url		= "the-candyglitch";
var category		= "seasonal";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/the_candyglitch_1319680251.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/the_candyglitch_1319680251_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/the_candyglitch_1319680251_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/the_candyglitch_1319680251_40.png";
function on_apply(pc){
	
}
var conditions = {
	621 : {
		type	: "group_count",
		group	: "zilloween_candy_given",
		value	: "499"
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
	pc.stats_add_favor_points("zille", round_to_5(175 * multiplier));
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
		"giant"		: "zille",
		"points"	: 175
	}
};

//log.info("the_candyglitch.js LOADED");

// generated ok (NO DATE)
