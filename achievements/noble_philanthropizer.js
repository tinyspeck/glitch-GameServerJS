var name		= "Noble Philanthropizer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gave 79 gifts to other players";
var status_text		= "You give and give and it never hurts. You've achieved Noble Philanthropizer status.";
var last_published	= 1348801933;
var is_shareworthy	= 1;
var url		= "noble-philanthropizer";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/noble_philanthropizer_1304984041.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/noble_philanthropizer_1304984041_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/noble_philanthropizer_1304984041_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/noble_philanthropizer_1304984041_40.png";
function on_apply(pc){
	
}
var conditions = {
	223 : {
		type	: "group_sum",
		group	: "items_given",
		value	: "79"
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
	pc.stats_add_favor_points("friendly", round_to_5(25 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 25
	}
};

//log.info("noble_philanthropizer.js LOADED");

// generated ok (NO DATE)
