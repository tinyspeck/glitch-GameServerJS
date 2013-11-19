var name		= "Order of the Third Otter";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Ranked among the top contributors for 3 feats";
var status_text		= "Truly, you belong to the Order of the Third Otter: a small, select group of feat-farers who have fought their way to the top of three contributor tables. Huzzah!";
var last_published	= 1351302517;
var is_shareworthy	= 1;
var url		= "order-of-the-third-otter";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/order_of_the_third_otter_1351300701.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/order_of_the_third_otter_1351300701_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/order_of_the_third_otter_1351300701_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/order_of_the_third_otter_1351300701_40.png";
function on_apply(pc){
	
}
var conditions = {
	850 : {
		type	: "counter",
		group	: "feats",
		label	: "top_26",
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
	pc.stats_add_xp(round_to_5(1250 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(73 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1250,
	"favor"	: {
		"giant"		: "all",
		"points"	: 73
	}
};

//log.info("order_of_the_third_otter.js LOADED");

// generated ok (NO DATE)
