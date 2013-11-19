var name		= "Death Metallurgist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Professionally rubbed 501 Plain Metal Ingots into Molybdenum";
var status_text		= "Remember back when you earned the title Thrash Metallurgist? The feeling of teeth-gritted, hair-flapping glory? Well, cherish that feeling, times two, mon frere. You've just earned the title Death Metallurgist. The most hardcore Metallurgist there is.";
var last_published	= 1348797433;
var is_shareworthy	= 1;
var url		= "death-metallurgist";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/death_metallurgist_1315685817.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/death_metallurgist_1315685817_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/death_metallurgist_1315685817_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/death_metallurgist_1315685817_40.png";
function on_apply(pc){
	
}
var conditions = {
	465 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "176",
		value	: "501"
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
	pc.stats_add_favor_points("ti", round_to_5(175 * multiplier));
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
		"giant"		: "ti",
		"points"	: 175
	}
};

//log.info("death_metallurgist.js LOADED");

// generated ok (NO DATE)
