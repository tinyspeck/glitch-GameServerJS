var name		= "Egg Poacher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gently harvested 503 Eggs";
var status_text		= "Congratulations, Egg lover. You've just earned the title of Egg Poacher. It sounds all dangerous, but really you're just a regular person. A regular person who likes Eggs.";
var last_published	= 1348797717;
var is_shareworthy	= 1;
var url		= "egg-poacher";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_poacher_1304984422.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_poacher_1304984422_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_poacher_1304984422_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_poacher_1304984422_40.png";
function on_apply(pc){
	
}
var conditions = {
	290 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "egg_plain",
		value	: "503"
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
	pc.stats_add_favor_points("spriggan", round_to_5(40 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 40
	}
};

//log.info("egg_poacher.js LOADED");

// generated ok (NO DATE)
