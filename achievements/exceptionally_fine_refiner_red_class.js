var name		= "Exceptionally Fine Refiner, Red Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Exactingly refined 10007 Red Elements";
var status_text		= "For your generally unswerving dedication to the element-smooshing arts, you've earned the designation Exceptionally Fine Refiner.";
var last_published	= 1348798410;
var is_shareworthy	= 1;
var url		= "exceptionally-fine-refiner-red-class";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_red_class_1304984869.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_red_class_1304984869_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_red_class_1304984869_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/exceptionally_fine_refiner_red_class_1304984869_40.png";
function on_apply(pc){
	
}
var conditions = {
	370 : {
		type	: "counter",
		group	: "elements_refined",
		label	: "element_red",
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

//log.info("exceptionally_fine_refiner_red_class.js LOADED");

// generated ok (NO DATE)
