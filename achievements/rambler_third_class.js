var name		= "Rambler, Third Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited 61 new locations.";
var status_text		= "You sure have itchy feet! We don't have any soothing ointment, but we do have this Rambler, Third Class badge. Cherish it!";
var last_published	= 1348802473;
var is_shareworthy	= 1;
var url		= "rambler-third-class";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/rambler_third_class_1316414511.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/rambler_third_class_1316414511_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/rambler_third_class_1316414511_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/rambler_third_class_1316414511_40.png";
function on_apply(pc){
	
}
var conditions = {
	5 : {
		type	: "group_count",
		group	: "locations_visited",
		value	: "61"
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
	pc.stats_add_favor_points("lem", round_to_5(40 * multiplier));
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
		"giant"		: "lem",
		"points"	: 40
	}
};

//log.info("rambler_third_class.js LOADED");

// generated ok (NO DATE)
