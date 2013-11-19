var name		= "The Hugginator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Squoze 503 Chickens in a too-friendly sorta way";
var status_text		= "Has it occurred to you that maybe you're taking this Chicken-squeezing thing too far? Think of this Hugginator badge as a friendly reminder to keep things in perspective.";
var last_published	= 1348802912;
var is_shareworthy	= 1;
var url		= "the-hugginator";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/the_hugginator_1304984184.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/the_hugginator_1304984184_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/the_hugginator_1304984184_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/the_hugginator_1304984184_40.png";
function on_apply(pc){
	
}
var conditions = {
	249 : {
		type	: "counter",
		group	: "chicken",
		label	: "squoze",
		value	: "503"
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
	pc.stats_add_favor_points("humbaba", round_to_5(150 * multiplier));
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
		"giant"		: "humbaba",
		"points"	: 150
	}
};

//log.info("the_hugginator.js LOADED");

// generated ok (NO DATE)
