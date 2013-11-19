var name		= "Super Tricksy-Treater";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gave Candy to 257 Lucky Candy-Lovers during Zilloween";
var status_text		= "257 candies given to happy candy-eaters? You clearly don't believe in hoarding the sweet stuff. And why would you, honeybuns? You're sweet enough already! (Yeech. Sorry)";
var last_published	= 1348802886;
var is_shareworthy	= 1;
var url		= "super-tricksy-treater";
var category		= "seasonal";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/super_tricksy_treater_1319680247.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/super_tricksy_treater_1319680247_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/super_tricksy_treater_1319680247_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/super_tricksy_treater_1319680247_40.png";
function on_apply(pc){
	
}
var conditions = {
	620 : {
		type	: "group_count",
		group	: "zilloween_candy_given",
		value	: "257"
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
	pc.stats_add_favor_points("zille", round_to_5(125 * multiplier));
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
		"giant"		: "zille",
		"points"	: 125
	}
};

//log.info("super_tricksy_treater.js LOADED");

// generated ok (NO DATE)
