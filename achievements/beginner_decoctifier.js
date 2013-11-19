var name		= "Beginner Decoctifier";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Prepared 7 unique recipes.";
var status_text		= "You're starting to know your way around the kitchen. You've earned a Beginner Decoctifier badge!";
var last_published	= 1323914099;
var is_shareworthy	= 0;
var url		= "beginner-decoctifier";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/beginner_decoctifier_1315979173.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/beginner_decoctifier_1315979173_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/beginner_decoctifier_1315979173_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/beginner_decoctifier_1315979173_40.png";
function on_apply(pc){
	
}
var conditions = {
	12 : {
		type	: "group_count",
		group	: "making_food",
		value	: "7"
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
	pc.stats_add_xp(round_to_5(75 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 75,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 10
	}
};

//log.info("beginner_decoctifier.js LOADED");

// generated ok (NO DATE)
