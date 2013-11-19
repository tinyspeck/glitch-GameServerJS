var name		= "Hero of the Cubimals";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Freed 53 Cubimals";
var status_text		= "53 Cubimals are now breathing free air thanks to you. Sure, they have their freedom, but what do you have? You have a badge! Woohoo!";
var last_published	= 1348799134;
var is_shareworthy	= 1;
var url		= "hero-of-the-cubimals";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/hero_of_the_cubimals_1339702833.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/hero_of_the_cubimals_1339702833_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/hero_of_the_cubimals_1339702833_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/hero_of_the_cubimals_1339702833_40.png";
function on_apply(pc){
	
}
var conditions = {
	707 : {
		type	: "group_sum",
		group	: "cubimals_freed",
		value	: "53"
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
	pc.stats_add_xp(round_to_5(900 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(175 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 900,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 175
	}
};

//log.info("hero_of_the_cubimals.js LOADED");

// generated ok (NO DATE)
