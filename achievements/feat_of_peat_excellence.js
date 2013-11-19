var name		= "Feat of Peat Excellence";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 1009 slightly funky Blocks of Peat";
var status_text		= "You've just officially harvested your 1009th Block of Peat. Is this a Feat of Peat Excellence or just a random moment? It's both!";
var last_published	= 1348798438;
var is_shareworthy	= 1;
var url		= "feat-of-peat-excellence";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/feat_of_peat_excellence_1315686013.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/feat_of_peat_excellence_1315686013_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/feat_of_peat_excellence_1315686013_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/feat_of_peat_excellence_1315686013_40.png";
function on_apply(pc){
	
}
var conditions = {
	526 : {
		type	: "counter",
		group	: "completed_harvest",
		label	: "peat_bog",
		value	: "1009"
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
	pc.stats_add_favor_points("mab", round_to_5(100 * multiplier));
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
		"giant"		: "mab",
		"points"	: 100
	}
};

//log.info("feat_of_peat_excellence.js LOADED");

// generated ok (NO DATE)
