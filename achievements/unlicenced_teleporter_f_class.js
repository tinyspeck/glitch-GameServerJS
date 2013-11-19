var name		= "Unlicensed Teleporter (F Class)";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Teleported 501 times, with almost perfect reassembly every time";
var status_text		= "Teleportation! It's the wave of the future! But first let's celebrate the wave of the past. For your 501 practically flawless teleports, you've just earned the title Unlicensed Teleporter, F Class.";
var last_published	= 1348803080;
var is_shareworthy	= 1;
var url		= "unlicenced-teleporter-f-class";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicenced_teleporter_f_class_1315686105.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicenced_teleporter_f_class_1315686105_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicenced_teleporter_f_class_1315686105_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicenced_teleporter_f_class_1315686105_40.png";
function on_apply(pc){
	
}
var conditions = {
	562 : {
		type	: "group_sum",
		group	: "teleportation_self",
		value	: "501"
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
	pc.stats_add_favor_points("lem", round_to_5(100 * multiplier));
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
		"giant"		: "lem",
		"points"	: 100
	}
};

//log.info("unlicenced_teleporter_f_class.js LOADED");

// generated ok (NO DATE)
