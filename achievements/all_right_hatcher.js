var name		= "All Right Hatcher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Incubated three Eggs, with some help from a Chicken";
var status_text		= "You've just incubated three Eggs! Though, technically, a Chicken did most of the work. But Chickens hate awards, so here. This All Right Hatcher award is for you.";
var last_published	= 1349313892;
var is_shareworthy	= 1;
var url		= "all-right-hatcher";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/all_right_hatcher_1304984155.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/all_right_hatcher_1304984155_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/all_right_hatcher_1304984155_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/all_right_hatcher_1304984155_40.png";
function on_apply(pc){
	
}
var conditions = {
	243 : {
		type	: "group_sum",
		group	: "eggs_incubated",
		value	: "3"
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

//log.info("all_right_hatcher.js LOADED");

// generated ok (NO DATE)
