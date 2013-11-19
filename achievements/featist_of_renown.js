var name		= "Featist of Renown";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Contributed to 53 incredible feats";
var status_text		= "Your name is whispered by waving weeds and dancing leaves on streets of Ur that would not have been imagined into creation but for the 53 feats you fot. Bravo!";
var last_published	= 1351302475;
var is_shareworthy	= 1;
var url		= "featist-of-renown";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/featist_of_renown_1351300684.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/featist_of_renown_1351300684_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/featist_of_renown_1351300684_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/featist_of_renown_1351300684_40.png";
function on_apply(pc){
	
}
var conditions = {
	839 : {
		type	: "counter",
		group	: "feats",
		label	: "contributed",
		value	: "53"
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
	pc.stats_add_xp(round_to_5(1500 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(79 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1500,
	"favor"	: {
		"giant"		: "all",
		"points"	: 79
	}
};

//log.info("featist_of_renown.js LOADED");

// generated ok (NO DATE)
