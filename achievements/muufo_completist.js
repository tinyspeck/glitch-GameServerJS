var name		= "Muufo Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Muufo";
var status_text		= "Conquerer of every majestic mountain crag and fair foothill, the ancient people of the region would have called you Muufokerologist. But that was deemed a ridiculous name, and instead you've earned the right to brag to anyone who'll listen that you bear the title \"Muufo Completist\".";
var last_published	= 1350066411;
var is_shareworthy	= 1;
var url		= "muufo-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-22\/muufo_completist_1316741860.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-22\/muufo_completist_1316741860_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-22\/muufo_completist_1316741860_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-22\/muufo_completist_1316741860_40.png";
function on_apply(pc){
	
}
var conditions = {
	599 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_97",
		value	: "32"
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 20
	}
};

//log.info("muufo_completist.js LOADED");

// generated ok (NO DATE)
