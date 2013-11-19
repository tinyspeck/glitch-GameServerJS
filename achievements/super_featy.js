var name		= "Super-Featy";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Contributed to 137 astounding feats";
var status_text		= "Tireless? Maybe. Determined? Certainly. Displaying traits of Super-Glitchian feat-conquering powers? Yes, yes, 137 times yes. Mazel Tov!";
var last_published	= 1351302479;
var is_shareworthy	= 1;
var url		= "super-featy";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/super_featy_1351300686.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/super_featy_1351300686_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/super_featy_1351300686_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/super_featy_1351300686_40.png";
function on_apply(pc){
	
}
var conditions = {
	840 : {
		type	: "counter",
		group	: "feats",
		label	: "contributed",
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
	pc.stats_add_xp(round_to_5(2500 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(107 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 2500,
	"favor"	: {
		"giant"		: "all",
		"points"	: 107
	}
};

//log.info("super_featy.js LOADED");

// generated ok (NO DATE)
