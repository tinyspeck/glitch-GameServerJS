var name		= "Mid-Level Admixificator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Beaker to stir 11 powders";
var status_text		= "That was a stirring act of admixificating. For that, you've earned the glorious and noble title of Mid-Level Admixificator.";
var last_published	= 1348801880;
var is_shareworthy	= 1;
var url		= "midlevel-admixificator";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/midlevel_admixificator_1304984100.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/midlevel_admixificator_1304984100_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/midlevel_admixificator_1304984100_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/midlevel_admixificator_1304984100_40.png";
function on_apply(pc){
	
}
var conditions = {
	234 : {
		type	: "counter",
		group	: "making_tool",
		label	: "beaker",
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

//log.info("midlevel_admixificator.js LOADED");

// generated ok (NO DATE)
