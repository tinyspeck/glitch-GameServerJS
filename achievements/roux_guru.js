var name		= "Roux Guru";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Simmered 23 concoctions in a Saucepan";
var status_text		= "No lumps here! You're a certified Roux Guru.";
var last_published	= 1338919154;
var is_shareworthy	= 0;
var url		= "roux-guru";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/roux_guru_1304983440.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/roux_guru_1304983440_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/roux_guru_1304983440_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/roux_guru_1304983440_40.png";
function on_apply(pc){
	
}
var conditions = {
	38 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "saucepan",
		value	: "23"
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
	pc.stats_add_favor_points("pot", round_to_5(20 * multiplier));
	pc.making_try_learn_recipe(49);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 150,
	"favor"		: {
		"giant"		: "pot",
		"points"	: 20
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "49",
			"label"		: "Cloudberry Jam",
			"id"		: 49
		}
	}
};

//log.info("roux_guru.js LOADED");

// generated ok (NO DATE)
