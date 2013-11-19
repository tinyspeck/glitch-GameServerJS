var name		= "Piggy Hash Slinger 1st Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Fed 103 little Piglets until they grew up into Piggies";
var status_text		= "Your hash slinging is so righteous that 103 Piglets have munched their way to full-grown Piggydom under your care. Each and every one of those Piggies considers you a Piggy Hash Slinger 1st Class.";
var last_published	= 1348802220;
var is_shareworthy	= 1;
var url		= "piggy-hash-slinger-1st-class";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/piggy_hash_slinger_1st_class_1304984250.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/piggy_hash_slinger_1st_class_1304984250_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/piggy_hash_slinger_1st_class_1304984250_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/piggy_hash_slinger_1st_class_1304984250_40.png";
function on_apply(pc){
	
}
var conditions = {
	258 : {
		type	: "counter",
		group	: "animals_grown",
		label	: "piglet",
		value	: "103"
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
	pc.stats_add_favor_points("humbaba", round_to_5(125 * multiplier));
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
		"giant"		: "humbaba",
		"points"	: 125
	}
};

//log.info("piggy_hash_slinger_1st_class.js LOADED");

// generated ok (NO DATE)
