var name		= "Executive in Charge of Spice Reformatation";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Converted 2003 Spices";
var status_text		= "Sure, Executive In Charge of Spice Reformatation sounds all made-uppy, but it's not. You've made it to the highest echelon of Spicery.";
var last_published	= 1348798421;
var is_shareworthy	= 1;
var url		= "executive-in-charge-of-spice-reformatation";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/executive_in_charge_of_spice_reformatation_1304984370.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/executive_in_charge_of_spice_reformatation_1304984370_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/executive_in_charge_of_spice_reformatation_1304984370_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/executive_in_charge_of_spice_reformatation_1304984370_40.png";
function on_apply(pc){
	
}
var conditions = {
	281 : {
		type	: "counter",
		group	: "making_tool",
		label	: "spice_mill",
		value	: "2003"
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(175 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 175
	}
};

//log.info("executive_in_charge_of_spice_reformatation.js LOADED");

// generated ok (NO DATE)
