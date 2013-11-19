var name		= "Noted Epicure";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Ate 503 meals";
var status_text		= "You just ate your 503rd meal. All hail the glorification of calorification! You've just earned the Noted Epicure badge.";
var last_published	= 1338926323;
var is_shareworthy	= 0;
var url		= "noted-epicure";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/noted_epicure_1304983569.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/noted_epicure_1304983569_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/noted_epicure_1304983569_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/noted_epicure_1304983569_40.png";
function on_apply(pc){
	
}
var conditions = {
	424 : {
		type	: "group_sum",
		group	: "meals_eaten",
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 100
	}
};

//log.info("noted_epicure.js LOADED");

// generated ok (NO DATE)
