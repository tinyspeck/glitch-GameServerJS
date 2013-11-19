var name		= "Thrash Metallurgist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Professionally rubbed 137 Plain Metal Ingots into Molybdenum";
var status_text		= "Now you've thrashed your way up the Metallurgy pile, and created your 137th Molybdenum Ingot, you'll finally be recognised as a true Thrash Metallurgist. But there's always room for improvement.";
var last_published	= 1348802935;
var is_shareworthy	= 1;
var url		= "thrash-metallurgist";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/thrash_metallurgist_1315685815.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/thrash_metallurgist_1315685815_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/thrash_metallurgist_1315685815_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/thrash_metallurgist_1315685815_40.png";
function on_apply(pc){
	
}
var conditions = {
	464 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "176",
		value	: "137"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "ti",
		"points"	: 100
	}
};

//log.info("thrash_metallurgist.js LOADED");

// generated ok (NO DATE)
