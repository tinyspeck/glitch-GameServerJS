var name		= "Gastronaut";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Successfully converted 2003 Gasses";
var status_text		= "Gastronaut might not sound like a sexy title, but your dedication, drive, and can-do approach to converting 2003 gases sure is. Sexy, that is.";
var last_published	= 1348798504;
var is_shareworthy	= 1;
var url		= "gastronaut";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gastronaut_1304984375.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gastronaut_1304984375_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gastronaut_1304984375_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gastronaut_1304984375_40.png";
function on_apply(pc){
	
}
var conditions = {
	282 : {
		type	: "counter",
		group	: "making_tool",
		label	: "gassifier",
		value	: "2003"
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 200
	}
};

//log.info("gastronaut.js LOADED");

// generated ok (NO DATE)
