var name		= "Blendmaster";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Blended 41 drinks or sno cones with a Blender.";
var status_text		= "You've blended, blended and blended some more until your blender-button finger was numb, and your brain rang with the song of the blender. It was worth it though, 41 drinks later. Bravo, Blendmaster.";
var last_published	= 1351724334;
var is_shareworthy	= 0;
var url		= "blendmaster";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/blendmaster_1304983608.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/blendmaster_1304983608_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/blendmaster_1304983608_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/blendmaster_1304983608_40.png";
function on_apply(pc){
	
}
var conditions = {
	418 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "blender",
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(40 * multiplier));
	pc.making_try_learn_recipe(59);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 300,
	"favor"		: {
		"giant"		: "pot",
		"points"	: 40
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "59",
			"label"		: "Savory Smoothie",
			"id"		: 59
		}
	}
};

//log.info("blendmaster.js LOADED");

// generated ok (NO DATE)
