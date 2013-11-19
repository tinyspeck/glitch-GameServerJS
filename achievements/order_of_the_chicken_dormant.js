var name		= "Order of the Chicken Dormant";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Won 43 Games";
var status_text		= "How rare is a sleeping chicken? As rare as a challenger that can win 43 games in a row. That's what knights of the Order of the Chicken Dormant believe: and that's why they're proud to call you sibling, and gather you into their feathery midst.";
var last_published	= 1348802157;
var is_shareworthy	= 1;
var url		= "order-of-the-chicken-dormant";
var category		= "games";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_chicken_dormant_1315512126.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_chicken_dormant_1315512126_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_chicken_dormant_1315512126_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_chicken_dormant_1315512126_40.png";
function on_apply(pc){
	
}
var conditions = {
	588 : {
		type	: "counter",
		group	: "it_game",
		label	: "won",
		value	: "43"
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
	pc.stats_add_favor_points("friendly", round_to_5(100 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 100
	}
};

//log.info("order_of_the_chicken_dormant.js LOADED");

// generated ok (NO DATE)
