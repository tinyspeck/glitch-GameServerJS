var name		= "Unlicensed Teleporter (Z Class)";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Teleported 10,009 times, with almost perfect reassembly every time";
var status_text		= "Not sure which is more impressive: the fact that you've done all that teleporting, or the fact that you did it without researching its long-term effects. Either way, congratulations! You've moved up the ranks to Unlicensed Teleporter, Z Class.";
var last_published	= 1348803090;
var is_shareworthy	= 1;
var url		= "unlicensed-teleporter-z-class";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicensed_teleporter_z_class_1315686098.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicensed_teleporter_z_class_1315686098_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicensed_teleporter_z_class_1315686098_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicensed_teleporter_z_class_1315686098_40.png";
function on_apply(pc){
	
}
var conditions = {
	559 : {
		type	: "group_sum",
		group	: "teleportation_self",
		value	: "10009"
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
	pc.stats_add_xp(round_to_5(1250 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(250 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1250,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 250
	}
};

//log.info("unlicensed_teleporter_z_class.js LOADED");

// generated ok (NO DATE)
