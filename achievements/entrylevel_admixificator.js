var name		= "Entry-Level Admixificator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Beaker to stir three powders";
var status_text		= "You and your Beaker are causing quite a stir around these parts. You've earned the status Entry-Level Admixificator.";
var last_published	= 1338918371;
var is_shareworthy	= 0;
var url		= "entrylevel-admixificator";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/entrylevel_admixificator_1304984093.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/entrylevel_admixificator_1304984093_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/entrylevel_admixificator_1304984093_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/entrylevel_admixificator_1304984093_40.png";
function on_apply(pc){
	
}
var conditions = {
	233 : {
		type	: "counter",
		group	: "making_tool",
		label	: "beaker",
		value	: "3"
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
	pc.stats_add_favor_points("ti", round_to_5(25 * multiplier));
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
		"giant"		: "ti",
		"points"	: 25
	}
};

//log.info("entrylevel_admixificator.js LOADED");

// generated ok (NO DATE)
