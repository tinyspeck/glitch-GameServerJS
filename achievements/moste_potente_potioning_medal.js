var name		= "Moste Potente Potioning Medal";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Bubbled up 11 potions";
var status_text		= "Whisperer of the magical elements, amateur cauldron wrangler, tickler of the underside of the Dark Arts: you have entered the portal of Potionmaking (to the tune of 11). May you never look back!";
var last_published	= 1348801906;
var is_shareworthy	= 1;
var url		= "moste-potente-potioning-medal";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/moste_potente_potioning_medal_1322093710.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/moste_potente_potioning_medal_1322093710_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/moste_potente_potioning_medal_1322093710_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/moste_potente_potioning_medal_1322093710_40.png";
function on_apply(pc){
	
}
var conditions = {
	645 : {
		type	: "counter",
		group	: "making_tool",
		label	: "cauldron",
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

//log.info("moste_potente_potioning_medal.js LOADED");

// generated ok (NO DATE)
