var name		= "Hollow Leg Award";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Wet your whistle 23 times";
var status_text		= "Salut! You've won the Hollow Leg Award.";
var last_published	= 1348799149;
var is_shareworthy	= 1;
var url		= "hollow-leg-award";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hollow_leg_award_1304983582.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hollow_leg_award_1304983582_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hollow_leg_award_1304983582_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hollow_leg_award_1304983582_40.png";
function on_apply(pc){
	
}
var conditions = {
	420 : {
		type	: "counter",
		group	: "items_drank",
		label	: "alcohol",
		value	: "23"
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 20
	}
};

//log.info("hollow_leg_award.js LOADED");

// generated ok (NO DATE)
