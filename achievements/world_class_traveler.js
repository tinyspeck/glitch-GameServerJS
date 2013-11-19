var name		= "World-Class Traveler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited 757 new locations.";
var status_text		= "You've got a serious case of wanderlove. You've earned World-Class Traveler status!";
var last_published	= 1348803105;
var is_shareworthy	= 1;
var url		= "world-class-traveler";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/world_class_traveler_1316414518.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/world_class_traveler_1316414518_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/world_class_traveler_1316414518_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/world_class_traveler_1316414518_40.png";
function on_apply(pc){
	
}
var conditions = {
	9 : {
		type	: "group_count",
		group	: "locations_visited",
		value	: "757"
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
	pc.stats_add_xp(round_to_5(1250 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(225 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1250,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 225
	}
};

//log.info("world_class_traveler.js LOADED");

// generated ok (NO DATE)
