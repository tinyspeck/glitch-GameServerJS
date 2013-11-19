var name		= "Spice Intern";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Converted 53 Spices";
var status_text		= "Some day you may look back on the achievement of converting 53 spices and say 'I was so naive back then.' But for now, bask in the glory of your Spice Intern badge.";
var last_published	= 1339620779;
var is_shareworthy	= 0;
var url		= "spice-intern";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/spice_intern_1304984296.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/spice_intern_1304984296_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/spice_intern_1304984296_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/spice_intern_1304984296_40.png";
function on_apply(pc){
	
}
var conditions = {
	267 : {
		type	: "counter",
		group	: "making_tool",
		label	: "spice_mill",
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

//log.info("spice_intern.js LOADED");

// generated ok (NO DATE)
