var name		= "Starter for Tinsmithery";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Lovingly rubbed 41 basic Plain Metal Ingots into superior Tin";
var status_text		= "You done rubbed that Tin real good, creating for yourself a promising Starter for Tinsmithery, and earning yourself the title of Starter Tinsmith. Whether you want that title or not is your business, not mine.";
var last_published	= 1315937029;
var is_shareworthy	= 0;
var url		= "starter-for-tinsmithery";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/starter_for_tinsmithery_1315685820.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/starter_for_tinsmithery_1315685820_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/starter_for_tinsmithery_1315685820_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/starter_for_tinsmithery_1315685820_40.png";
function on_apply(pc){
	
}
var conditions = {
	466 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "174",
		value	: "41"
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(30 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "ti",
		"points"	: 30
	}
};

//log.info("starter_for_tinsmithery.js LOADED");

// generated ok (NO DATE)
