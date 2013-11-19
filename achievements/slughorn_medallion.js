var name		= "Slughorn Medallion";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Conjured up 47 Potions";
var status_text		= "The Metaphorical Medallion of Master Slughorn - someone who was purported to know a lot about potions back in the day - is awarded to anyone who has made 47 Potions. Someone like… well… you! YAY!";
var last_published	= 1348802841;
var is_shareworthy	= 1;
var url		= "slughorn-medallion";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/slughorn_medallion_1322093712.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/slughorn_medallion_1322093712_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/slughorn_medallion_1322093712_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/slughorn_medallion_1322093712_40.png";
function on_apply(pc){
	
}
var conditions = {
	646 : {
		type	: "counter",
		group	: "making_tool",
		label	: "cauldron",
		value	: "47"
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
	pc.stats_add_favor_points("ti", round_to_5(40 * multiplier));
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
		"giant"		: "ti",
		"points"	: 40
	}
};

//log.info("slughorn_medallion.js LOADED");

// generated ok (NO DATE)
