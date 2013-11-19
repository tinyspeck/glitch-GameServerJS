var name		= "The Cigar";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "Came very close to top contributor status";
var status_text		= "You came close to the category of Top Feat Contributor: so close. So very very close. Some would say 'close, but no cigar'. But they would be wrong, because you came close AND got The Cigar. Gratz.";
var last_published	= 1351294317;
var is_shareworthy	= 1;
var url		= "the-cigar";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/the_cigar_1351300706.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/the_cigar_1351300706_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/the_cigar_1351300706_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/the_cigar_1351300706_40.png";
function on_apply(pc){
	
}
var conditions = {
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(37 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "all",
		"points"	: 37
	}
};

//log.info("the_cigar.js LOADED");

// generated ok (NO DATE)
