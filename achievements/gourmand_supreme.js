var name		= "Gourmand Supreme";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gormandized 1009 meals";
var status_text		= "With 1,009 meals under your belt, you've gormandized aplenty. You are hereby awarded the title Gourmand Supreme!";
var last_published	= 1338926722;
var is_shareworthy	= 0;
var url		= "gourmand-supreme";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gourmand_supreme_1304983574.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gourmand_supreme_1304983574_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gourmand_supreme_1304983574_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gourmand_supreme_1304983574_40.png";
function on_apply(pc){
	
}
var conditions = {
	425 : {
		type	: "group_sum",
		group	: "meals_eaten",
		value	: "1009"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 150
	}
};

//log.info("gourmand_supreme.js LOADED");

// generated ok (NO DATE)
