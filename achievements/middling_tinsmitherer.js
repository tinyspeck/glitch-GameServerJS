var name		= "Middling Tinsmitherer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Lovingly rubbed 137 basic Plain Metal Ingots into superior Tin";
var status_text		= "Well, shiver my tinsnips. Put down those Alchemical Tongs for a little old minute and give yourself a pat on the back. You've just rubbed your 137th Plain Ingot into Tin, and you've done gone and earned yourself the title Middling Tinsmith.";
var last_published	= 1348801875;
var is_shareworthy	= 1;
var url		= "middling-tinsmitherer";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/middling_tinsmitherer_1315685823.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/middling_tinsmitherer_1315685823_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/middling_tinsmitherer_1315685823_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/middling_tinsmitherer_1315685823_40.png";
function on_apply(pc){
	
}
var conditions = {
	467 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "174",
		value	: "137"
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
	pc.stats_add_favor_points("ti", round_to_5(50 * multiplier));
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
		"giant"		: "ti",
		"points"	: 50
	}
};

//log.info("middling_tinsmitherer.js LOADED");

// generated ok (NO DATE)
