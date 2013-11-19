var name		= "Order of the Seventh Seal";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Ranked among the top contributors for 7 feats";
var status_text		= "Named after an ancient sea mammal who was particularly fond of high-level participation in feats, you have been awarded the Order of the Seventh Seal. Kudos, seven-time top contributor.";
var last_published	= 1351302522;
var is_shareworthy	= 1;
var url		= "order-of-the-seventh-seal";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/order_of_the_seventh_seal_1351300703.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/order_of_the_seventh_seal_1351300703_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/order_of_the_seventh_seal_1351300703_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/order_of_the_seventh_seal_1351300703_40.png";
function on_apply(pc){
	
}
var conditions = {
	851 : {
		type	: "counter",
		group	: "feats",
		label	: "top_26",
		value	: "7"
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
	pc.stats_add_xp(round_to_5(2750 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(137 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 2750,
	"favor"	: {
		"giant"		: "all",
		"points"	: 137
	}
};

//log.info("order_of_the_seventh_seal.js LOADED");

// generated ok (NO DATE)
