var name		= "Killer Griller";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Delicately charred 79 dishes with a Famous Pugilist Grill.";
var status_text		= "Is it getting hot in here or what? You've earned one Killer Griller badge, fresh off the grill.";
var last_published	= 1348801462;
var is_shareworthy	= 1;
var url		= "killer-griller";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/killer_griller_1304983427.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/killer_griller_1304983427_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/killer_griller_1304983427_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/killer_griller_1304983427_40.png";
function on_apply(pc){
	
}
var conditions = {
	35 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "mike_tyson_grill",
		value	: "79"
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
	pc.stats_add_xp(round_to_5(350 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(45 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 350,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 45
	}
};

//log.info("killer_griller.js LOADED");

// generated ok (NO DATE)
