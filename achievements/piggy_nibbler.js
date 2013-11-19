var name		= "Piggy Nibbler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gently nibbled 17 piggies";
var status_text		= "Nice work! Those Piggies aren't going to nibble themselves, you know. You've earned a Piggy Nibbler badge.";
var last_published	= 1348802224;
var is_shareworthy	= 1;
var url		= "piggy-nibbler";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/piggy_nibbler_1304983758.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/piggy_nibbler_1304983758_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/piggy_nibbler_1304983758_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/piggy_nibbler_1304983758_40.png";
function on_apply(pc){
	
}
var conditions = {
	172 : {
		type	: "counter",
		group	: "npc_piggy",
		label	: "nibble",
		value	: "17"
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
	pc.stats_add_xp(round_to_5(75 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 75,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 10
	}
};

//log.info("piggy_nibbler.js LOADED");

// generated ok (NO DATE)
