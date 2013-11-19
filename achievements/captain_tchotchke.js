var name		= "Captain Tchotchke";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Blithely crafted 51 decorative base items";
var status_text		= "Some believe in a minimalism, choosing items that are useful, and only useful. Others go the other way, and fill their lives with things that are decorative but useless. You… well, no judgies. Here's your badge.";
var last_published	= 1348797061;
var is_shareworthy	= 1;
var url		= "captain-tchotchke";
var category		= "furniture";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/captain_tchotchke_1339700460.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/captain_tchotchke_1339700460_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/captain_tchotchke_1339700460_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/captain_tchotchke_1339700460_40.png";
function on_apply(pc){
	
}
var conditions = {
	746 : {
		type	: "counter",
		group	: "furniture_decos",
		label	: "made",
		value	: "51"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 100
	}
};

//log.info("captain_tchotchke.js LOADED");

// generated ok (NO DATE)
