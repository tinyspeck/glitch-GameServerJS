var name		= "Minor Refiner, Blue Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Carefully refined 251 Blue Elements";
var status_text		= "You can't refine Blue Elements without crushing a few Chunks. And you can't refine 251 Blue Elements without earning a new badge: Minor Refiner, Blue Class. Them's the rules.";
var last_published	= 1338930536;
var is_shareworthy	= 0;
var url		= "minor-refiner-blue-class";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_blue_class_1304984837.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_blue_class_1304984837_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_blue_class_1304984837_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_blue_class_1304984837_40.png";
function on_apply(pc){
	
}
var conditions = {
	363 : {
		type	: "counter",
		group	: "elements_refined",
		label	: "element_blue",
		value	: "251"
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
	pc.stats_add_favor_points("zille", round_to_5(15 * multiplier));
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
		"giant"		: "zille",
		"points"	: 15
	}
};

//log.info("minor_refiner_blue_class.js LOADED");

// generated ok (NO DATE)
