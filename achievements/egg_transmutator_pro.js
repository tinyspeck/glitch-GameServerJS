var name		= "Egg Transmutator Pro";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Seasoned a staggering 503 Eggs";
var status_text		= "Being a professional-caliber Egg seasoner might mean people will give you more respect and free drinks. Maybe. But at the very least you get an Egg Transmutator Pro badge out of the deal.";
var last_published	= 1348797727;
var is_shareworthy	= 1;
var url		= "egg-transmutator-pro";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_transmutator_pro_1304984340.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_transmutator_pro_1304984340_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_transmutator_pro_1304984340_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_transmutator_pro_1304984340_40.png";
function on_apply(pc){
	
}
var conditions = {
	276 : {
		type	: "counter",
		group	: "making_tool",
		label	: "egg_seasoner",
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(125 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 125
	}
};

//log.info("egg_transmutator_pro.js LOADED");

// generated ok (NO DATE)
