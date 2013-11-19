var name		= "Fine Refiner, Shiny Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Fastidiously refined 1009 Shiny Elements";
var status_text		= "A steady hand, and an even steadier temper, is required to refine as many Shiny Elements as you have. You have earned the title Fine Refiner, Shiny Class.";
var last_published	= 1338930607;
var is_shareworthy	= 0;
var url		= "fine-refiner-shiny-class";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fine_refiner_shiny_class_1304984880.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fine_refiner_shiny_class_1304984880_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fine_refiner_shiny_class_1304984880_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fine_refiner_shiny_class_1304984880_40.png";
function on_apply(pc){
	
}
var conditions = {
	372 : {
		type	: "counter",
		group	: "elements_refined",
		label	: "element_shiny",
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(25 * multiplier));
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
		"giant"		: "zille",
		"points"	: 25
	}
};

//log.info("fine_refiner_shiny_class.js LOADED");

// generated ok (NO DATE)
