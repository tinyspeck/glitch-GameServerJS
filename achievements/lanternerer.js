var name		= "Lanternerer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Lit and Displayed a Pumpkin Lantern";
var status_text		= "You brought the holiday into your heart and displayed it proudly outside or inside your home (the holiday, not your heart, that would be gross). For your dedication to lanterns and lanterning, you get this Lanternerer badge.";
var last_published	= 1348801478;
var is_shareworthy	= 1;
var url		= "lanternerer";
var category		= "seasonal";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-27\/lanternerer_1319740040.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-27\/lanternerer_1319740040_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-27\/lanternerer_1319740040_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-27\/lanternerer_1319740040_40.png";
function on_apply(pc){
	
}
var conditions = {
	623 : {
		type	: "counter",
		group	: "pumpkins_placed",
		label	: "lit",
		value	: "1"
	},
	624 : {
		type	: "group_sum",
		group	: "VERB:light",
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(30 * multiplier));
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
		"giant"		: "zille",
		"points"	: 30
	}
};

//log.info("lanternerer.js LOADED");

// generated ok (NO DATE)
