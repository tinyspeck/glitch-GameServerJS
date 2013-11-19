var name		= "Pretty Fine Refiner, Green Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Thoroughly refined 2503 Green Elements";
var status_text		= "Not only was that a dazzling display of masterful chunk crushery, it also marked the 2503rd Green Element you've refined. Is there a badge for that, you ask? Do you even have to ask?";
var last_published	= 1338930567;
var is_shareworthy	= 0;
var url		= "pretty-fine-refiner-green-class";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_refiner_green_class_1304984829.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_refiner_green_class_1304984829_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_refiner_green_class_1304984829_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_refiner_green_class_1304984829_40.png";
function on_apply(pc){
	
}
var conditions = {
	361 : {
		type	: "counter",
		group	: "elements_refined",
		label	: "element_green",
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

//log.info("pretty_fine_refiner_green_class.js LOADED");

// generated ok (NO DATE)
