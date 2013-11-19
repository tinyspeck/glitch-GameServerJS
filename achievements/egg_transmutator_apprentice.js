var name		= "Egg Transmutator Apprentice";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Seasoned 53 Eggs";
var status_text		= "53 Eggs seasoned, eh? Well, it's a start. You now have an Egg Transmutator Apprentice badge to hang on your wall. If you have a wall, that is.";
var last_published	= 1339620380;
var is_shareworthy	= 0;
var url		= "egg-transmutator-apprentice";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_transmutator_apprentice_1304984310.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_transmutator_apprentice_1304984310_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_transmutator_apprentice_1304984310_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_transmutator_apprentice_1304984310_40.png";
function on_apply(pc){
	
}
var conditions = {
	270 : {
		type	: "counter",
		group	: "making_tool",
		label	: "egg_seasoner",
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 25
	}
};

//log.info("egg_transmutator_apprentice.js LOADED");

// generated ok (NO DATE)
