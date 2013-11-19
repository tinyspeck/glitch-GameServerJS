var name		= "Exceptionally Fine Refiner, Green Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Thoroughly refined 10007 Green Elements";
var status_text		= "Well, it's been quite a grind, but you made it. You've earned the title Exceptionally Fine Refiner, Green Class.";
var last_published	= 1348798406;
var is_shareworthy	= 1;
var url		= "exceptionally-fine-refiner-green-class";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_green_class_1304984833.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_green_class_1304984833_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_green_class_1304984833_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_green_class_1304984833_40.png";
function on_apply(pc){
	
}
var conditions = {
	362 : {
		type	: "counter",
		group	: "elements_refined",
		label	: "element_green",
		value	: "10007"
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
	pc.stats_add_favor_points("zille", round_to_5(100 * multiplier));
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
		"giant"		: "zille",
		"points"	: 100
	}
};

//log.info("exceptionally_fine_refiner_green_class.js LOADED");

// generated ok (NO DATE)
