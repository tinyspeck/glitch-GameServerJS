var name		= "Getting-There Tree Hugger";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Braved splinters to pet 127 Trees";
var status_text		= "You've braved splinters to pet 127 Trees. You've earned the middling glory of being a Getting-There Tree Hugger.";
var last_published	= 1338931311;
var is_shareworthy	= 0;
var url		= "gettingthere-tree-hugger";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gettingthere_tree_hugger_1304984614.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gettingthere_tree_hugger_1304984614_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gettingthere_tree_hugger_1304984614_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gettingthere_tree_hugger_1304984614_40.png";
function on_apply(pc){
	
}
var conditions = {
	322 : {
		type	: "group_sum",
		group	: "trants_petted",
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(40 * multiplier));
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
		"giant"		: "grendaline",
		"points"	: 40
	}
};

//log.info("gettingthere_tree_hugger.js LOADED");

// generated ok (NO DATE)
