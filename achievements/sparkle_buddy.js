var name		= "Sparkle Buddy";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Made seven players extra-happy at the same time with Sparkle Powder";
var status_text		= "Waytago! A regular life of the party you are, making all those nice people happy with your Sparkle Powder. You deserve the coveted Sparkle Buddy badge.";
var last_published	= 1316303737;
var is_shareworthy	= 0;
var url		= "sparkle-buddy";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/sparkle_buddy_1304984077.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/sparkle_buddy_1304984077_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/sparkle_buddy_1304984077_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/sparkle_buddy_1304984077_40.png";
function on_apply(pc){
	
}
var conditions = {
	230 : {
		type	: "counter",
		group	: "powders",
		label	: "sparkle_buddy",
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(15 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 15
	}
};

//log.info("sparkle_buddy.js LOADED");

// generated ok (NO DATE)
