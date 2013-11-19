var name		= "Cunning like a Foxbrusher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Brushed 31 foxes while they were moving";
var status_text		= "Fast-moving vulpines are no match for your brilliant brain. Cunning Like a Foxbrusher, you've snatched fibers from 31 foxes on the move. You deserve a round of applause, and a badge. Here's the badge.";
var last_published	= 1348797402;
var is_shareworthy	= 1;
var url		= "cunning-like-a-foxbrusher";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/cunning_like_a_foxbrusher_1339712004.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/cunning_like_a_foxbrusher_1339712004_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/cunning_like_a_foxbrusher_1339712004_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/cunning_like_a_foxbrusher_1339712004_40.png";
function on_apply(pc){
	
}
var conditions = {
	740 : {
		type	: "counter",
		group	: "fox",
		label	: "brushed_while_moving",
		value	: "31"
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(70 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 70
	}
};

//log.info("cunning_like_a_foxbrusher.js LOADED");

// generated ok (NO DATE)
