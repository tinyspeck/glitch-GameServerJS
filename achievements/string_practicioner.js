var name		= "String Practitioner";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Skillfully spun fiber directly into string (requires Spellbound Spindle upgrade)";
var status_text		= "You'd heard crazy theories about string arising from the loom of those almost supernaturally skilled in the fiber arts. But string theory is one thing. String practice is another. You nailed it, String Practicioner!";
var last_published	= 1340308020;
var is_shareworthy	= 0;
var url		= "string-practicioner";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/string_practicioner_1339698257.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/string_practicioner_1339698257_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/string_practicioner_1339698257_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/string_practicioner_1339698257_40.png";
function on_apply(pc){
	
}
var conditions = {
	755 : {
		type	: "counter",
		group	: "spun",
		label	: "straight_to_string",
		value	: "1"
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
	pc.stats_add_favor_points("humbaba", round_to_5(100 * multiplier));
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
		"giant"		: "humbaba",
		"points"	: 100
	}
};

//log.info("string_practicioner.js LOADED");

// generated ok (NO DATE)
