var name		= "Numismatizer, Dragon Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Collected 100 quoins a day for 17 game days in a row";
var status_text		= "There's a fine line between quoin collecting and quoin hoarding, and you've danced across that line with the graceful abandon of a nimble young dragon. Hence your newly earned title: Numismatizer, Dragon Class.";
var last_published	= 1348801947;
var is_shareworthy	= 1;
var url		= "numismatizer-dragon-class";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/numismatizer_dragon_class_1315685869.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/numismatizer_dragon_class_1315685869_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/numismatizer_dragon_class_1315685869_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/numismatizer_dragon_class_1315685869_40.png";
function on_apply(pc){
	
}
var conditions = {
	478 : {
		type	: "counter",
		group	: "coin_count",
		label	: "days_maxed",
		value	: "17"
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
	pc.stats_add_favor_points("lem", round_to_5(225 * multiplier));
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
		"giant"		: "lem",
		"points"	: 225
	}
};

//log.info("numismatizer_dragon_class.js LOADED");

// generated ok (NO DATE)
