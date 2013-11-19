var name		= "Licensed Teleporter (Pfft Class)";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Amazingly, attracted followers for 127 practically pain-free teleports";
var status_text		= "Teleportation is a really handy way to get yourself and other players from Point A to Point Q. The convenience pretty much makes the side effects worthwhile. Celebrate your nonchalant attitude toward particle displacement with your promotion to Licensed Teleporter, Pfft Class.";
var last_published	= 1348801493;
var is_shareworthy	= 1;
var url		= "licenced-teleporter-pfft-class";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licenced_teleporter_pfft_class_1315686093.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licenced_teleporter_pfft_class_1315686093_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licenced_teleporter_pfft_class_1315686093_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licenced_teleporter_pfft_class_1315686093_40.png";
function on_apply(pc){
	
}
var conditions = {
	557 : {
		type	: "group_sum",
		group	: "teleportation_self_withfollowers",
		value	: "127"
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
	pc.stats_add_favor_points("lem", round_to_5(125 * multiplier));
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
		"points"	: 125
	}
};

//log.info("licenced_teleporter_pfft_class.js LOADED");

// generated ok (NO DATE)
