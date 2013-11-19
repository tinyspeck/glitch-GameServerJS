var name		= "Fox Flurrier";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "With 9 Glitches, witnessed the simultaneous presence of three foxes in one location";
var status_text		= "A flurry of foxes was yours to behold, a number of foxes - three foxes, all told. You witnessed the foxes, and that sure was fun… but now looky here at the badge that you won!";
var last_published	= 1348798475;
var is_shareworthy	= 1;
var url		= "fox-flurrier";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/fox_flurrier_1339718157.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/fox_flurrier_1339718157_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/fox_flurrier_1339718157_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/fox_flurrier_1339718157_40.png";
function on_apply(pc){
	
}
var conditions = {
	738 : {
		type	: "counter",
		group	: "fox",
		label	: "three_or_more",
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 50
	}
};

//log.info("fox_flurrier.js LOADED");

// generated ok (NO DATE)
