var name		= "Aftershock Award";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gamely gulped down 11 Earthshakers";
var status_text		= "Whoa! Did you feel the ground move? For drinking 11 Earthshakers, you definitely deserve an Aftershock Award.";
var last_published	= 1348796079;
var is_shareworthy	= 1;
var url		= "aftershock-award";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/aftershock_award_1304983778.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/aftershock_award_1304983778_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/aftershock_award_1304983778_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/aftershock_award_1304983778_40.png";
function on_apply(pc){
	
}
var conditions = {
	176 : {
		type	: "counter",
		group	: "items_drank",
		label	: "earthshaker",
		value	: "11"
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
	pc.stats_add_favor_points("friendly", round_to_5(15 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 15
	}
};

//log.info("aftershock_award.js LOADED");

// generated ok (NO DATE)
