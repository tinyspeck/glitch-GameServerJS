var name		= "Minor Refiner, Green Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Thoroughly refined 251 Green Elements";
var status_text		= "Refiner? But you hardly even know her. For enduring that joke, and for refining 251 Green Elements, you have earned the title Minor Refiner, Green Class.";
var last_published	= 1338930556;
var is_shareworthy	= 0;
var url		= "minor-refiner-green-class";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_green_class_1304984819.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_green_class_1304984819_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_green_class_1304984819_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_green_class_1304984819_40.png";
function on_apply(pc){
	
}
var conditions = {
	359 : {
		type	: "counter",
		group	: "elements_refined",
		label	: "element_green",
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

//log.info("minor_refiner_green_class.js LOADED");

// generated ok (NO DATE)
