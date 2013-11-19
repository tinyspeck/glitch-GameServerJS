var name		= "Unlicensed Teleporter (N Class)";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Teleported 2501 times, with almost perfect reassembly every time";
var status_text		= "Congratulations! Your new title, Unlicensed Teleporter, N Class, is eight letters further in the alphabet than your F Class designation. What difference this makes is a source of wild speculation.";
var last_published	= 1348803087;
var is_shareworthy	= 1;
var url		= "unlicensed-teleporter-n-class";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicensed_teleporter_n_class_1315686103.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicensed_teleporter_n_class_1315686103_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicensed_teleporter_n_class_1315686103_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/unlicensed_teleporter_n_class_1315686103_40.png";
function on_apply(pc){
	
}
var conditions = {
	561 : {
		type	: "group_sum",
		group	: "teleportation_self",
		value	: "2501"
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
	pc.stats_add_favor_points("lem", round_to_5(200 * multiplier));
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
		"giant"		: "lem",
		"points"	: 200
	}
};

//log.info("unlicensed_teleporter_n_class.js LOADED");

// generated ok (NO DATE)
