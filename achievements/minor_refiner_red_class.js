var name		= "Minor Refiner, Red Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Exactingly refined 251 Red Elements";
var status_text		= "You have refined 251 Red Elements to their finest particulate. This may not earn you the adulation of your peers, but it does earn you the title Minor Refiner, Red class.";
var last_published	= 1338930576;
var is_shareworthy	= 0;
var url		= "minor-refiner-red-class";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_red_class_1304984854.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_red_class_1304984854_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_red_class_1304984854_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_red_class_1304984854_40.png";
function on_apply(pc){
	
}
var conditions = {
	367 : {
		type	: "counter",
		group	: "elements_refined",
		label	: "element_red",
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

//log.info("minor_refiner_red_class.js LOADED");

// generated ok (NO DATE)
