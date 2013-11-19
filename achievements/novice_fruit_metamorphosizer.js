var name		= "Novice Fruit Metamorphosizer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Converted 53 Fruit";
var status_text		= "Bravo for you and your newfound passion for helping Cherries find meaningful life as other fruits. You are now a Novice Fruit Metamorphosizer.";
var last_published	= 1339620700;
var is_shareworthy	= 0;
var url		= "novice-fruit-metamorphosizer";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/novice_fruit_metamorphosizer_1304984292.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/novice_fruit_metamorphosizer_1304984292_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/novice_fruit_metamorphosizer_1304984292_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/novice_fruit_metamorphosizer_1304984292_40.png";
function on_apply(pc){
	
}
var conditions = {
	266 : {
		type	: "counter",
		group	: "making_tool",
		label	: "fruit_changing_machine",
		value	: "53"
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 25
	}
};

//log.info("novice_fruit_metamorphosizer.js LOADED");

// generated ok (NO DATE)
