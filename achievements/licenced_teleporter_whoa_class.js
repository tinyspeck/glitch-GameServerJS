var name		= "Licensed Teleporter (Whoa Class)";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Teleported 503 times while towing hapless followers";
var status_text		= "This marks the 503rd time you've successfully teleported with one or more players. Do you have any idea how many particles that is? 90 trillion times a thousand? Something like that.";
var last_published	= 1348801497;
var is_shareworthy	= 1;
var url		= "licenced-teleporter-whoa-class";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licenced_teleporter_whoa_class_1315686095.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licenced_teleporter_whoa_class_1315686095_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licenced_teleporter_whoa_class_1315686095_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licenced_teleporter_whoa_class_1315686095_40.png";
function on_apply(pc){
	
}
var conditions = {
	558 : {
		type	: "group_sum",
		group	: "teleportation_self_withfollowers",
		value	: "503"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 150
	}
};

//log.info("licenced_teleporter_whoa_class.js LOADED");

// generated ok (NO DATE)
