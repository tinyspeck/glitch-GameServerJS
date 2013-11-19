var name		= "Potion Patron";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Quaffed or poured 7 Potions";
var status_text		= "They may taste foul, but who cares? Potions! You've poured down seven of 'em! ZAP!";
var last_published	= 1338918149;
var is_shareworthy	= 0;
var url		= "potion-patron";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/potion_patron_1322093722.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/potion_patron_1322093722_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/potion_patron_1322093722_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/potion_patron_1322093722_40.png";
function on_apply(pc){
	
}
var conditions = {
	657 : {
		type	: "group_sum",
		group	: "potions_used",
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(20 * multiplier));
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
		"giant"		: "ti",
		"points"	: 20
	}
};

//log.info("potion_patron.js LOADED");

// generated ok (NO DATE)
