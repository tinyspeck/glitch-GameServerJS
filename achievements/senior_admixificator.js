var name		= "Senior Admixificator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Beaker to stir 41 powders";
var status_text		= "You've reached the highest pinnacle of admixing glory. Now show the world with your new title of Senior Admixificator.";
var last_published	= 1348802526;
var is_shareworthy	= 1;
var url		= "senior-admixificator";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/senior_admixificator_1304984107.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/senior_admixificator_1304984107_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/senior_admixificator_1304984107_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/senior_admixificator_1304984107_40.png";
function on_apply(pc){
	
}
var conditions = {
	235 : {
		type	: "counter",
		group	: "making_tool",
		label	: "beaker",
		value	: "41"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "ti",
		"points"	: 150
	}
};

//log.info("senior_admixificator.js LOADED");

// generated ok (NO DATE)
