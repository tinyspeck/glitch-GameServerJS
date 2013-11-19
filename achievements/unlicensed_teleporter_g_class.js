var name		= "Unlicensed Teleporter (G Class)";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Teleported 199 times, with almost perfect reassembly every time";
var status_text		= "For teleporting yourself 199 times and re-assembling yourself almost perfectly every time, you've earned the title Unlicensed Teleporter, G Class.";
var last_published	= 1348803083;
var is_shareworthy	= 1;
var url		= "unlicensed-teleporter-g-class";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicensed_teleporter_g_class_1315686100.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicensed_teleporter_g_class_1315686100_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicensed_teleporter_g_class_1315686100_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicensed_teleporter_g_class_1315686100_40.png";
function on_apply(pc){
	
}
var conditions = {
	560 : {
		type	: "group_sum",
		group	: "teleportation_self",
		value	: "199"
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
	pc.stats_add_favor_points("lem", round_to_5(75 * multiplier));
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
		"giant"		: "lem",
		"points"	: 75
	}
};

//log.info("unlicensed_teleporter_g_class.js LOADED");

// generated ok (NO DATE)
