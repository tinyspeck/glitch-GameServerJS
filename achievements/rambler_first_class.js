var name		= "Rambler, First Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited 251 new locations.";
var status_text		= "You've roamed and rambled and followed your footsteps, and now you've earned the title Rambler, First Class!";
var last_published	= 1348802465;
var is_shareworthy	= 1;
var url		= "rambler-first-class";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/rambler_first_class_1316414515.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/rambler_first_class_1316414515_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/rambler_first_class_1316414515_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/rambler_first_class_1316414515_40.png";
function on_apply(pc){
	
}
var conditions = {
	7 : {
		type	: "group_count",
		group	: "locations_visited",
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(150 * multiplier));
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
		"giant"		: "lem",
		"points"	: 150
	}
};

//log.info("rambler_first_class.js LOADED");

// generated ok (NO DATE)
