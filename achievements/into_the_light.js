var name		= "Into the Light";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Brilliantly crafted 11 lamps";
var status_text		= "Who brings light into ordinary lives? You do. Quite literally. For bringing at least 11 glitches Into The Light (of a lamp), take this badge, oh luminous one.";
var last_published	= 1348801442;
var is_shareworthy	= 1;
var url		= "into-the-light";
var category		= "furniture";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/into_the_light_1339700604.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/into_the_light_1339700604_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/into_the_light_1339700604_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/into_the_light_1339700604_40.png";
function on_apply(pc){
	
}
var conditions = {
	747 : {
		type	: "counter",
		group	: "furniture_lamps",
		label	: "made",
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(75 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 75
	}
};

//log.info("into_the_light.js LOADED");

// generated ok (NO DATE)
