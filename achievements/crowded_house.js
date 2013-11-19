var name		= "Crowded House";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Graciously hosted three guests at once in your house";
var status_text		= "It may not look too full, but if three's a crowd, then consider your house stuffed to the gills by the people you invited in. Phew! Is it hot in here, House Crowder?!";
var last_published	= 1348797388;
var is_shareworthy	= 1;
var url		= "crowded-house";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-15\/crowded_house_1339782483.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-15\/crowded_house_1339782483_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-15\/crowded_house_1339782483_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-15\/crowded_house_1339782483_40.png";
function on_apply(pc){
	
}
var conditions = {
	767 : {
		type	: "counter",
		group	: "hosted_party",
		label	: "three",
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
	pc.stats_add_xp(round_to_5(350 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(60 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 60
	}
};

//log.info("crowded_house.js LOADED");

// generated ok (NO DATE)
