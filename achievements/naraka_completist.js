var name		= "Naraka Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Naraka";
var status_text		= "Many claim they've been to hell and back, er …  \"Naraka\" and back, but how many took in the sights while they were there? Not many. But you did. You roamed the fiery pits and came away with a heightened sense of your own mortality… and this lovely badge. Yay!";
var last_published	= 1350066429;
var is_shareworthy	= 1;
var url		= "naraka-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-01\/naraka_completist_1320199382.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-01\/naraka_completist_1320199382_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-01\/naraka_completist_1320199382_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-01\/naraka_completist_1320199382_40.png";
function on_apply(pc){
	
}
var conditions = {
	671 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_40",
		value	: "7"
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
	pc.stats_add_currants(round_to_5(100 * multiplier));
	pc.stats_add_favor_points("lem", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 300,
	"currants"	: 100,
	"favor"		: {
		"giant"		: "lem",
		"points"	: 40
	}
};

//log.info("naraka_completist.js LOADED");

// generated ok (NO DATE)
