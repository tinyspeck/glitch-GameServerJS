var name		= "Egg Enthusiast";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gently harvested 101 Eggs";
var status_text		= "Who doesn't enjoy harvesting a pile of Eggs now and again? Is that a trick question? You are hereby awarded the title Egg Enthusiast.";
var last_published	= 1336502608;
var is_shareworthy	= 0;
var url		= "egg-enthusiast";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_enthusiast_1304984387.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_enthusiast_1304984387_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_enthusiast_1304984387_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_enthusiast_1304984387_40.png";
function on_apply(pc){
	
}
var conditions = {
	284 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "egg_plain",
		value	: "101"
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(15 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 15
	}
};

//log.info("egg_enthusiast.js LOADED");

// generated ok (NO DATE)
