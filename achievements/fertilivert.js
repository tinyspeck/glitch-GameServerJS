var name		= "Fertilivert";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used Fertilidust on 4 Trees at once";
var status_text		= "You've just fertilized four Trees at once with your Fertilidust, thereby earning the title of Fertilivert. In the world of trees, this is an honor to wear with pride.";
var last_published	= 1320354083;
var is_shareworthy	= 0;
var url		= "fertilivert";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fertilivert_1304984063.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fertilivert_1304984063_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fertilivert_1304984063_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fertilivert_1304984063_40.png";
function on_apply(pc){
	
}
var conditions = {
	227 : {
		type	: "counter",
		group	: "powders",
		label	: "fertilivert",
		value	: "1"
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
	pc.stats_add_favor_points("mab", round_to_5(25 * multiplier));
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
		"giant"		: "mab",
		"points"	: 25
	}
};

//log.info("fertilivert.js LOADED");

// generated ok (NO DATE)
