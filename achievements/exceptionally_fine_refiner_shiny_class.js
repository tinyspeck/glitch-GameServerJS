var name		= "Exceptionally Fine Refiner, Shiny Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Fastidiously refined 10007 Shiny Elements";
var status_text		= "Sure, there is glory in becoming an Exceptionally Fine Refiner, Shiny Class. There is also the risk of Shiny-tosis. Be sure to perform regular self-examinations.";
var last_published	= 1348798416;
var is_shareworthy	= 1;
var url		= "exceptionally-fine-refiner-shiny-class";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_shiny_class_1304984891.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_shiny_class_1304984891_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_shiny_class_1304984891_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_shiny_class_1304984891_40.png";
function on_apply(pc){
	
}
var conditions = {
	374 : {
		type	: "counter",
		group	: "elements_refined",
		label	: "element_shiny",
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
	pc.stats_add_favor_points("zille", round_to_5(125 * multiplier));
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
		"points"	: 125
	}
};

//log.info("exceptionally_fine_refiner_shiny_class.js LOADED");

// generated ok (NO DATE)
