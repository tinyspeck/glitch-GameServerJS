var name		= "Mini Tricksy-Treater";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gave Candy to 5 Lucky Candy-Munchers during Zilloween";
var status_text		= "In giving candy away to five happy candy-eaters, you're truly the embodiment of the spirit of the holiday. Which holiday? Who CARES! It's candy!";
var last_published	= 1323924152;
var is_shareworthy	= 0;
var url		= "mini-tricksy-treater";
var category		= "seasonal";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/mini_tricksy_treater_1319680238.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/mini_tricksy_treater_1319680238_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/mini_tricksy_treater_1319680238_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/mini_tricksy_treater_1319680238_40.png";
function on_apply(pc){
	
}
var conditions = {
	617 : {
		type	: "group_count",
		group	: "zilloween_candy_given",
		value	: "5"
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
	pc.stats_add_favor_points("zille", round_to_5(15 * multiplier));
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
		"giant"		: "zille",
		"points"	: 15
	}
};

//log.info("mini_tricksy_treater.js LOADED");

// generated ok (NO DATE)
