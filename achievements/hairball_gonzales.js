var name		= "Hairball Gonzales";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "Went further, faster, than ever before";
var status_text		= "One minute you were there, next minute: gone. Like a greased hairball zipping through the streets of Ur, you covered 15 planks faster than a speeding bullet. Or \"slightly faster than normal\", anyway. ¡Arriba! ¡Arriba! ¡Epa! ¡Epa! ¡Epa!";
var last_published	= 1338918543;
var is_shareworthy	= 0;
var url		= "hairball-gonzales";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-01-17\/hairball_gonzales_1326824157.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-01-17\/hairball_gonzales_1326824157_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-01-17\/hairball_gonzales_1326824157_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-01-17\/hairball_gonzales_1326824157_40.png";
function on_apply(pc){
	
}
var conditions = {
	643 : {
		type	: "counter",
		group	: "essence_of_hairball",
		label	: "distance_dashed",
		value	: "6000"
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(75 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "ti",
		"points"	: 75
	}
};

//log.info("hairball_gonzales.js LOADED");

// generated ok (NO DATE)
