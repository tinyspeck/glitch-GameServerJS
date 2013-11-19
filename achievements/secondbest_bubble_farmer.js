var name		= "Second-Best Bubble Farmer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Ever-so-carefully harvested 1009 Bubbles";
var status_text		= "You've achieved the penultimate level of Bubble Farmerdom. Warning: Second-Best Bubble Farmers sometimes can't get over knowing that they're second best. Ask yourself, how are you going to handle your newfound status?";
var last_published	= 1348802519;
var is_shareworthy	= 1;
var url		= "secondbest-bubble-farmer";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/secondbest_bubble_farmer_1304984457.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/secondbest_bubble_farmer_1304984457_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/secondbest_bubble_farmer_1304984457_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/secondbest_bubble_farmer_1304984457_40.png";
function on_apply(pc){
	
}
var conditions = {
	297 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "plain_bubble",
		value	: "1009"
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 60
	}
};

//log.info("secondbest_bubble_farmer.js LOADED");

// generated ok (NO DATE)
