var name		= "Minor Tricksy-Treater";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gave Candy to 37 Lucky Candy-Eaters during Zilloween";
var status_text		= "Candyglitch Candyglitch Candygli… No, wait. Apparently something bad happens if I do that. Congrats on the title, though. You're certainly one generous Candyglitch. OH! WHOOPS!";
var last_published	= 1348801891;
var is_shareworthy	= 1;
var url		= "minor-tricksy-treater";
var category		= "seasonal";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/minor_tricksy_treater_1319680241.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/minor_tricksy_treater_1319680241_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/minor_tricksy_treater_1319680241_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/minor_tricksy_treater_1319680241_40.png";
function on_apply(pc){
	
}
var conditions = {
	618 : {
		type	: "group_count",
		group	: "zilloween_candy_given",
		value	: "37"
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(35 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 35
	}
};

//log.info("minor_tricksy_treater.js LOADED");

// generated ok (NO DATE)
