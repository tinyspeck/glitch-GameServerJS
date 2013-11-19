var name		= "Minor Refiner, Shiny Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Fastidiously refined 251 Shiny Elements";
var status_text		= "What's better than a Shiny Element? Why, 251 Shiny Elements, of course. For your refining efforts, you've earned yourself the title of Minor Refiner, Shiny Class.";
var last_published	= 1338930598;
var is_shareworthy	= 0;
var url		= "minor-refiner-shiny-class";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_shiny_class_1304984875.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_shiny_class_1304984875_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_shiny_class_1304984875_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/minor_refiner_shiny_class_1304984875_40.png";
function on_apply(pc){
	
}
var conditions = {
	371 : {
		type	: "counter",
		group	: "elements_refined",
		label	: "element_shiny",
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

//log.info("minor_refiner_shiny_class.js LOADED");

// generated ok (NO DATE)
