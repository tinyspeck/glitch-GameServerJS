var name		= "Order of the Rearing Piggy";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Won 11 Games";
var status_text		= "In days of yore, in Ur, when the Game of Crowns was used to determine knightly battles of honor, an order was formed representing the animal spirit of those who won 11 whole games. It still exists. Welcome to the Order of the Rearing Piggy. Rowr! Oink!";
var last_published	= 1338920533;
var is_shareworthy	= 0;
var url		= "order-of-the-rearing-piggy";
var category		= "games";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_rearing_piggy_1315512123.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_rearing_piggy_1315512123_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_rearing_piggy_1315512123_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_rearing_piggy_1315512123_40.png";
function on_apply(pc){
	
}
var conditions = {
	587 : {
		type	: "counter",
		group	: "it_game",
		label	: "won",
		value	: "11"
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 60
	}
};

//log.info("order_of_the_rearing_piggy.js LOADED");

// generated ok (NO DATE)
