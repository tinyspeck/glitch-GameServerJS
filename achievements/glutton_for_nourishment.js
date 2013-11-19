var name		= "Glutton for Nourishment";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Ate 41 meals";
var status_text		= "Yumbies! You're a Glutton for Nourishment, and now you have a badge to prove it.";
var last_published	= 1338922993;
var is_shareworthy	= 0;
var url		= "glutton-for-nourishment";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/glutton_for_nourishment_1304983560.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/glutton_for_nourishment_1304983560_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/glutton_for_nourishment_1304983560_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/glutton_for_nourishment_1304983560_40.png";
function on_apply(pc){
	
}
var conditions = {
	423 : {
		type	: "group_sum",
		group	: "meals_eaten",
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(25 * multiplier));
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
		"giant"		: "pot",
		"points"	: 25
	}
};

//log.info("glutton_for_nourishment.js LOADED");

// generated ok (NO DATE)
