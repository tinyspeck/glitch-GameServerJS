var name		= "Libatious Borage Award";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Masterfully Cauldronated 1033 Potions";
var status_text		= "Potionmaking? You literally wrote the book on potionmaking! Well, not *literally*, but you deserve the award in the name of the a man who did because you? You made a LOT of potions. 1033 in fact. Yowza.";
var last_published	= 1348801489;
var is_shareworthy	= 1;
var url		= "libatious-borage-award";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/libatious_borage_award_1322093719.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/libatious_borage_award_1322093719_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/libatious_borage_award_1322093719_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/libatious_borage_award_1322093719_40.png";
function on_apply(pc){
	
}
var conditions = {
	649 : {
		type	: "counter",
		group	: "making_tool",
		label	: "cauldron",
		value	: "1033"
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
	pc.stats_add_favor_points("ti", round_to_5(250 * multiplier));
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
		"giant"		: "ti",
		"points"	: 250
	}
};

//log.info("libatious_borage_award.js LOADED");

// generated ok (NO DATE)
