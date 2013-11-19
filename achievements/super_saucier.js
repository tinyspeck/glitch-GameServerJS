var name		= "Super Saucier";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Simmered 79 concoctions in a Saucepan";
var status_text		= "You've just earned a deglazed Super Saucier badge. Keep on stirring!";
var last_published	= 1348802879;
var is_shareworthy	= 1;
var url		= "super-saucier";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/super_saucier_1304983450.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/super_saucier_1304983450_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/super_saucier_1304983450_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/super_saucier_1304983450_40.png";
function on_apply(pc){
	
}
var conditions = {
	40 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "saucepan",
		value	: "79"
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
	pc.stats_add_favor_points("pot", round_to_5(45 * multiplier));
	pc.making_try_learn_recipe(44);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"favor"		: {
		"giant"		: "pot",
		"points"	: 45
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "44",
			"label"		: "Wavy Gravy",
			"id"		: 44
		}
	}
};

//log.info("super_saucier.js LOADED");

// generated ok (NO DATE)
