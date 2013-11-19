var name		= "Amorphous Crystallizer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Made 79 Plain Crystals";
var status_text		= "Well, well, looky here. With this, your 79th Plain Crystal, you've earned the not-terribly-self-explanatory title Amorphous Crystallizer.";
var last_published	= 1348796718;
var is_shareworthy	= 1;
var url		= "amorphous-crystallizer";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/amorphous_crystallizer_1315685880.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/amorphous_crystallizer_1315685880_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/amorphous_crystallizer_1315685880_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/amorphous_crystallizer_1315685880_40.png";
function on_apply(pc){
	
}
var conditions = {
	480 : {
		type	: "counter",
		group	: "crystallizer",
		label	: "crystalmalize",
		value	: "79"
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

//log.info("amorphous_crystallizer.js LOADED");

// generated ok (NO DATE)
