var name		= "Pulse, Frappe, Mix & Blend";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Blended 11 drinks or sno cones with a Blender.";
var status_text		= "You are starting to learn your way around a blender, that's for sure. As a token of your limited accomplishment so far, the Pulse, Frappe, Mix & Blend badge.";
var last_published	= 1351724320;
var is_shareworthy	= 0;
var url		= "pulse-frappe-mix-blend";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pulse_frappe_mix_blend_1304983617.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pulse_frappe_mix_blend_1304983617_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pulse_frappe_mix_blend_1304983617_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pulse_frappe_mix_blend_1304983617_40.png";
function on_apply(pc){
	
}
var conditions = {
	58 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "blender",
		value	: "11"
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
	pc.stats_add_favor_points("pot", round_to_5(15 * multiplier));
	pc.making_try_learn_recipe(55);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 100,
	"favor"		: {
		"giant"		: "pot",
		"points"	: 15
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "55",
			"label"		: "Mega Healthy Veggie Juice",
			"id"		: 55
		}
	}
};

//log.info("pulse_frappe_mix_blend.js LOADED");

// generated ok (NO DATE)
