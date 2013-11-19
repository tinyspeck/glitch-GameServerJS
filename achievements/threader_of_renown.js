var name		= "Threader of Renown";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Artfully reconstructed five necklace artifacts";
var status_text		= "Five glorious strings of tiny round reimagined beads have you slowly, painstakingly, reassembled into necklaces. Glory be, Threader, you deserve your renown. And: your badge!";
var last_published	= 1351302511;
var is_shareworthy	= 1;
var url		= "threader-of-renown";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/threader_of_renown_1351302328.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/threader_of_renown_1351302328_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/threader_of_renown_1351302328_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/threader_of_renown_1351302328_40.png";
function on_apply(pc){
	
}
var conditions = {
	855 : {
		type	: "group_count",
		group	: "necklaces_made",
		value	: "5"
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
	pc.stats_add_xp(round_to_5(3000 * multiplier), true);
	pc.stats_add_favor_points("cosma", round_to_5(250 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 3000,
	"favor"	: {
		"giant"		: "cosma",
		"points"	: 250
	}
};

//log.info("threader_of_renown.js LOADED");

// generated ok (NO DATE)
