var name		= "Participant Award - Bean Division";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 101 Beans";
var status_text		= "Look at you, harvesting Bean after Bean after Bean. Here's a little Participant Award for your effort.";
var last_published	= 1336502556;
var is_shareworthy	= 0;
var url		= "participant-award--bean-division";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/participant_award__bean_division_1304984383.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/participant_award__bean_division_1304984383_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/participant_award__bean_division_1304984383_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/participant_award__bean_division_1304984383_40.png";
function on_apply(pc){
	
}
var conditions = {
	283 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "bean_plain",
		value	: "101"
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(15 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 15
	}
};

//log.info("participant_award__bean_division.js LOADED");

// generated ok (NO DATE)
