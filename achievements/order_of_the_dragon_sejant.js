var name		= "Order of the Dragon Sejant";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Won 107 Games";
var status_text		= "When knights or Ur played Game of Crowns to decide rank, Dragons were thought as mythical and as awesome as someone who could win 107 games. You are that mythical, and that awesome. The Order of the Dragon Sejant bids you welcome.";
var last_published	= 1348802175;
var is_shareworthy	= 1;
var url		= "order-of-the-dragon-sejant";
var category		= "games";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_dragon_sejant_1315512130.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_dragon_sejant_1315512130_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_dragon_sejant_1315512130_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_dragon_sejant_1315512130_40.png";
function on_apply(pc){
	
}
var conditions = {
	589 : {
		type	: "counter",
		group	: "it_game",
		label	: "won",
		value	: "107"
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(175 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 175
	}
};

//log.info("order_of_the_dragon_sejant.js LOADED");

// generated ok (NO DATE)
