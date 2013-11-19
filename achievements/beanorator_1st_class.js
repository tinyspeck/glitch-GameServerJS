var name		= "Beanorator 1st Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Seasoned a whopping 503 Beans";
var status_text		= "Somewhere out there are 503 basic Beans that are now fancy Beans, and they have you to thank. You get a Beanorator 1st Class badge out of this deal.";
var last_published	= 1348796772;
var is_shareworthy	= 1;
var url		= "beanorator-1st-class";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/beanorator_1st_class_1304984334.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/beanorator_1st_class_1304984334_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/beanorator_1st_class_1304984334_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/beanorator_1st_class_1304984334_40.png";
function on_apply(pc){
	
}
var conditions = {
	275 : {
		type	: "counter",
		group	: "making_tool",
		label	: "bean_seasoner",
		value	: "503"
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
	pc.stats_add_favor_points("spriggan", round_to_5(125 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 125
	}
};

//log.info("beanorator_1st_class.js LOADED");

// generated ok (NO DATE)
