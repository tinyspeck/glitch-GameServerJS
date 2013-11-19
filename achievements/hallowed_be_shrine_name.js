var name		= "Hallowed Be Shrine Name";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Donated an expensive item to a Shrine under the effects of Extremely Hallowed Shrine Powder";
var status_text		= "Don't think donating an item as pricey as this goes unnoticed. Using the Extremely Hallowed Shrine Powder at the same time has helped you snag the coveted Hallowed Be Shrine Name badge.";
var last_published	= 1338918297;
var is_shareworthy	= 0;
var url		= "hallowed-be-shrine-name";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hallowed_be_shrine_name_1304984089.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hallowed_be_shrine_name_1304984089_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hallowed_be_shrine_name_1304984089_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hallowed_be_shrine_name_1304984089_40.png";
function on_apply(pc){
	
}
var conditions = {
	232 : {
		type	: "counter",
		group	: "powders",
		label	: "hallowed_be_shrine_name",
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(10 * multiplier));
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
		"giant"		: "all",
		"points"	: 10
	}
};

//log.info("hallowed_be_shrine_name.js LOADED");

// generated ok (NO DATE)
