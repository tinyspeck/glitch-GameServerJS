var name		= "Best Pal";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Made 111 friends";
var status_text		= "111 is, according to science, the perfect size for a social circle. Which makes you, Best Pal with a badge to prove it, the perfect social scientist.";
var last_published	= 1349461193;
var is_shareworthy	= 1;
var url		= "best-pal";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-14\/best_pal_1316061697.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-14\/best_pal_1316061697_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-14\/best_pal_1316061697_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-14\/best_pal_1316061697_40.png";
function on_apply(pc){
	
}
var conditions = {
	215 : {
		type	: "counter",
		group	: "player",
		label	: "buddies_count",
		value	: "111"
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
	pc.stats_add_favor_points("friendly", round_to_5(125 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 125
	}
};

//log.info("best_pal.js LOADED");

// generated ok (NO DATE)
