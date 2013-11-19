var name		= "Licensed Teleporter (Gee Class)";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Convinced 5 or more suckers, er, players to follow on 41 teleports";
var status_text		= "Teleporting other players is a sacred bond of trust. Namely, they trust that you're going to make sure all their bits come through intact. You've just been promoted to Licensed Teleporter, Gee Class.";
var last_published	= 1348801503;
var is_shareworthy	= 1;
var url		= "licensed-teleporter-gee-class";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licensed_teleporter_gee_class_1315686111.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licensed_teleporter_gee_class_1315686111_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licensed_teleporter_gee_class_1315686111_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licensed_teleporter_gee_class_1315686111_40.png";
function on_apply(pc){
	
}
var conditions = {
	564 : {
		type	: "group_sum",
		group	: "teleportation_self_withfollowers_5",
		value	: "41"
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

//log.info("licensed_teleporter_gee_class.js LOADED");

// generated ok (NO DATE)
