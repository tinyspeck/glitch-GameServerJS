var name		= "Pretty Fine Mulcher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Tended 79 weedy patches";
var status_text		= "Way to toil on the soil! You get a Pretty Fine Mulcher badge.";
var last_published	= 1336502290;
var is_shareworthy	= 0;
var url		= "pretty-fine-mulcher";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_mulcher_1304983847.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_mulcher_1304983847_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_mulcher_1304983847_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pretty_fine_mulcher_1304983847_40.png";
function on_apply(pc){
	
}
var conditions = {
	189 : {
		type	: "group_sum",
		group	: "VERB:tend",
		value	: "79"
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 60
	}
};

//log.info("pretty_fine_mulcher.js LOADED");

// generated ok (NO DATE)
