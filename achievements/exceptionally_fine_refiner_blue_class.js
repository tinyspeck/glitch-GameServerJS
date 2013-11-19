var name		= "Exceptionally Fine Refiner, Blue Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Carefully refined 10007 Blue Elements";
var status_text		= "It's elementary, my dear Glitchling. You've refined 10,007 Blue Elements, earning you the title Exceptionally Fine Refiner, Blue Class.";
var last_published	= 1348798401;
var is_shareworthy	= 1;
var url		= "exceptionally-fine-refiner-blue-class";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_blue_class_1304984850.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_blue_class_1304984850_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_blue_class_1304984850_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_blue_class_1304984850_40.png";
function on_apply(pc){
	
}
var conditions = {
	366 : {
		type	: "counter",
		group	: "elements_refined",
		label	: "element_blue",
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

//log.info("exceptionally_fine_refiner_blue_class.js LOADED");

// generated ok (NO DATE)
