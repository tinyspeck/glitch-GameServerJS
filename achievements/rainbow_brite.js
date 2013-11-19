var name		= "Rainbo Brite";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Whipped up 73 Rainbo Sno Cones in an unexcitingly generic red blender";
var status_text		= "You're the cutest, sparkliest, sprinkliest, twinkiest, wispiest rainboest sno cone blender-upper that ever there was! SQUEEE!";
var last_published	= 1351725155;
var is_shareworthy	= 1;
var url		= "rainbo-brite";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/rainbow_brite_1351618935.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/rainbow_brite_1351618935_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/rainbow_brite_1351618935_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/rainbow_brite_1351618935_40.png";
function on_apply(pc){
	
}
var conditions = {
	857 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "319",
		value	: "73"
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
	pc.stats_add_favor_points("pot", round_to_5(125 * multiplier));
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
		"giant"		: "pot",
		"points"	: 125
	}
};

//log.info("rainbow_brite.js LOADED");

// generated ok (NO DATE)
