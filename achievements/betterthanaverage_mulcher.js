var name		= "Better-Than-Average Mulcher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Tended 41 weedy patches";
var status_text		= "Wow! You've hoed a lot of weedy patches! We hope it wasn't too harrowing. You deserve a Better-Than-Average Mulcher badge.";
var last_published	= 1336502283;
var is_shareworthy	= 0;
var url		= "betterthanaverage-mulcher";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/betterthanaverage_mulcher_1304983843.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/betterthanaverage_mulcher_1304983843_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/betterthanaverage_mulcher_1304983843_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/betterthanaverage_mulcher_1304983843_40.png";
function on_apply(pc){
	
}
var conditions = {
	188 : {
		type	: "group_sum",
		group	: "VERB:tend",
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 40
	}
};

//log.info("betterthanaverage_mulcher.js LOADED");

// generated ok (NO DATE)
