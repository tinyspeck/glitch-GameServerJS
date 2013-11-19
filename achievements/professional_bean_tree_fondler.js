var name		= "Professional Bean Tree Fondler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Lovingly petted 127 Bean Trees";
var status_text		= "Know what's even better than a Not-Quite-Pro Bean Tree Fondler? A Professional Bean Tree Fondler, Which is you. Embrace the glory.";
var last_published	= 1348802261;
var is_shareworthy	= 1;
var url		= "professional-bean-tree-fondler";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/professional_bean_tree_fondler_1304984619.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/professional_bean_tree_fondler_1304984619_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/professional_bean_tree_fondler_1304984619_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/professional_bean_tree_fondler_1304984619_40.png";
function on_apply(pc){
	
}
var conditions = {
	323 : {
		type	: "counter",
		group	: "trants_petted",
		label	: "trant_bean",
		value	: "127"
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
	pc.stats_add_favor_points("grendaline", round_to_5(100 * multiplier));
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
		"giant"		: "grendaline",
		"points"	: 100
	}
};

//log.info("professional_bean_tree_fondler.js LOADED");

// generated ok (NO DATE)
