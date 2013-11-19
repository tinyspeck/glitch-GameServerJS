var name		= "Beanorator 2nd Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Seasoned 53 Beans";
var status_text		= "Congratulations on converting 53 basic Beans into fancy Beans. You can add a Beanorator 2nd Class badge to your collection.";
var last_published	= 1339620344;
var is_shareworthy	= 0;
var url		= "beanorator-2nd-class";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/beanorator_2nd_class_1304984305.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/beanorator_2nd_class_1304984305_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/beanorator_2nd_class_1304984305_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/beanorator_2nd_class_1304984305_40.png";
function on_apply(pc){
	
}
var conditions = {
	269 : {
		type	: "counter",
		group	: "making_tool",
		label	: "bean_seasoner",
		value	: "53"
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
	pc.stats_add_favor_points("spriggan", round_to_5(25 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 25
	}
};

//log.info("beanorator_2nd_class.js LOADED");

// generated ok (NO DATE)
