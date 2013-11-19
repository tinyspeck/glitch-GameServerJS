var name		= "Fine Refiner, Blue Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Carefully refined 1009 Blue Elements";
var status_text		= "We've lost count of the number of Chunks you've delicately pulverized to smitheroons, but we haven't lost count of the number of Blue Elements you've refined: 1009. That deserves a badge or something. Here's a badge. We're all out of something.";
var last_published	= 1338930541;
var is_shareworthy	= 0;
var url		= "fine-refiner-blue-class";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fine_refiner_blue_class_1304984841.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fine_refiner_blue_class_1304984841_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fine_refiner_blue_class_1304984841_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fine_refiner_blue_class_1304984841_40.png";
function on_apply(pc){
	
}
var conditions = {
	364 : {
		type	: "counter",
		group	: "elements_refined",
		label	: "element_blue",
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

//log.info("fine_refiner_blue_class.js LOADED");

// generated ok (NO DATE)
