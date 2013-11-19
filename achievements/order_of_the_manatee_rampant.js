var name		= "Order of the Manatee Rampant";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Won 503 Games";
var status_text		= "Nothing terrified novice knights of Ur more than the flag of The Order of the Manatee Rampant, with its flag depicting a giant angry seacow standing proud and victorious over the defeated combatants of 503 Games of Crowns. That flag is now yours. Huzzah!!!";
var last_published	= 1348802183;
var is_shareworthy	= 1;
var url		= "order-of-the-manatee-rampant";
var category		= "games";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_manatee_rampant_1315512135.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_manatee_rampant_1315512135_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_manatee_rampant_1315512135_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_manatee_rampant_1315512135_40.png";
function on_apply(pc){
	
}
var conditions = {
	591 : {
		type	: "counter",
		group	: "it_game",
		label	: "won",
		value	: "503"
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
	pc.stats_add_xp(round_to_5(2000 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(300 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 2000,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 300
	}
};

//log.info("order_of_the_manatee_rampant.js LOADED");

// generated ok (NO DATE)
