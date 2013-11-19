var name		= "Egg Freak";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gently harvested 5003 Eggs";
var status_text		= "Most people don't understand what it means to harvest 5003 eggs, but as one of the few true Egg Freaks, you do. Now you have the badge to show for it. Semper fritatta.";
var last_published	= 1348797711;
var is_shareworthy	= 1;
var url		= "egg-freak";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_freak_1304984491.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_freak_1304984491_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_freak_1304984491_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_freak_1304984491_40.png";
function on_apply(pc){
	
}
var conditions = {
	302 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "egg_plain",
		value	: "5003"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 150
	}
};

//log.info("egg_freak.js LOADED");

// generated ok (NO DATE)
