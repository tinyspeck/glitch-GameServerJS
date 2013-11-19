var name		= "Outstanding Coddler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gobbled up 251 eggs";
var status_text		= "You've gobbled up a lot of eggs. You've earned the title Outstanding Coddler.";
var last_published	= 1348802190;
var is_shareworthy	= 1;
var url		= "outstanding-coddler";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/outstanding_coddler_1304983540.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/outstanding_coddler_1304983540_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/outstanding_coddler_1304983540_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/outstanding_coddler_1304983540_40.png";
function on_apply(pc){
	
}
var conditions = {
	53 : {
		type	: "counter",
		group	: "items_eaten",
		label	: "egg_plain",
		value	: "251"
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
	pc.stats_add_favor_points("pot", round_to_5(50 * multiplier));
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
		"giant"		: "pot",
		"points"	: 50
	}
};

//log.info("outstanding_coddler.js LOADED");

// generated ok (NO DATE)
