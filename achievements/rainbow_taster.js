var name		= "Rainbo Taster";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Blenderized 17 Rainbo Sno Cones";
var status_text		= "You carefully constructed enough Rainbo Sno Cones to become a certified, qualified Taster of Rainbo. Word.";
var last_published	= 1351711762;
var is_shareworthy	= 1;
var url		= "rainbo-taster";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/rainbow_taster_1351618931.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/rainbow_taster_1351618931_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/rainbow_taster_1351618931_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/rainbow_taster_1351618931_40.png";
function on_apply(pc){
	
}
var conditions = {
	856 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "319",
		value	: "17"
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
	pc.stats_add_favor_points("pot", round_to_5(60 * multiplier));
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
		"points"	: 60
	}
};

//log.info("rainbow_taster.js LOADED");

// generated ok (NO DATE)
