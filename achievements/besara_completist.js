var name		= "Besara Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Besara";
var status_text		= "Each lush leafy street in Besara is like a second home to you now. Or, at least, \"like a street you have visited\", if \"second home\" is a little strong, because you have walked down them all, you Besara Completist you.";
var last_published	= 1350065474;
var is_shareworthy	= 1;
var url		= "besara-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-03\/besara_completist_1317703261.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-03\/besara_completist_1317703261_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-03\/besara_completist_1317703261_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-03\/besara_completist_1317703261_40.png";
function on_apply(pc){
	
}
var conditions = {
	604 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_98",
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

//log.info("besara_completist.js LOADED");

// generated ok (NO DATE)
