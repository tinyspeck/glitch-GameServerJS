var name		= "First-Best Bubble Farmer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Ever-so-carefully harvested 5003 Bubbles";
var status_text		= "Glory of glories, you are now a First-Best Bubble Farmer! Go ahead and let that go to your head.";
var last_published	= 1348798465;
var is_shareworthy	= 1;
var url		= "firstbest-bubble-farmer";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/firstbest_bubble_farmer_1304984496.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/firstbest_bubble_farmer_1304984496_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/firstbest_bubble_farmer_1304984496_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/firstbest_bubble_farmer_1304984496_40.png";
function on_apply(pc){
	
}
var conditions = {
	303 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "plain_bubble",
		value	: "5003"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 150
	}
};

//log.info("firstbest_bubble_farmer.js LOADED");

// generated ok (NO DATE)
