var name		= "Pretty Fine Refiner, Red Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Exactingly refined 2503 Red Elements";
var status_text		= "You have gone positively medieval on the buns of the common Red Element. This makes you a Pretty Fine Refiner, Red Class.";
var last_published	= 1338930587;
var is_shareworthy	= 0;
var url		= "pretty-fine-refiner-red-class";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_refiner_red_class_1304984864.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_refiner_red_class_1304984864_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_refiner_red_class_1304984864_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_refiner_red_class_1304984864_40.png";
function on_apply(pc){
	
}
var conditions = {
	369 : {
		type	: "counter",
		group	: "elements_refined",
		label	: "element_red",
		value	: "2503"
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 50
	}
};

//log.info("pretty_fine_refiner_red_class.js LOADED");

// generated ok (NO DATE)
