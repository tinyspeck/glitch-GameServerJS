var name		= "The Rainbo Connection";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Magically blended 317 Rainbo Sno Cones (in a distinctly non-magical blender)";
var status_text		= "Rainbo Sno Cones: Are they visions? Illusions? Something with nothing to hide? Or are they just the delicious frozen blended treat that just snagged you a badge? All of the above. And more. That's why there's so many songs about them.";
var last_published	= 1351711772;
var is_shareworthy	= 1;
var url		= "rainbo-connection";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/rainbow_connection_1351618939.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/rainbow_connection_1351618939_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/rainbow_connection_1351618939_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/rainbow_connection_1351618939_40.png";
function on_apply(pc){
	
}
var conditions = {
	858 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "319",
		value	: "317"
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
	pc.stats_add_xp(round_to_5(1200 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(250 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1200,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 250
	}
};

//log.info("rainbow_connection.js LOADED");

// generated ok (NO DATE)
