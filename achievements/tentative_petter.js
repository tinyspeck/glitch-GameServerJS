var name		= "Tentative Petter";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Tentatively petted 11 Spice Plants";
var status_text		= "Pettifying the first 11 Spice Plants is the trickiest. And when you think about it, it wasn't even all that tricky. Be that as it may, you've earned a Tentative Petter badge.";
var last_published	= 1338931280;
var is_shareworthy	= 0;
var url		= "tentative-petter";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/tentative_petter_1304984544.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/tentative_petter_1304984544_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/tentative_petter_1304984544_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/tentative_petter_1304984544_40.png";
function on_apply(pc){
	
}
var conditions = {
	312 : {
		type	: "counter",
		group	: "trants_petted",
		label	: "trant_spice",
		value	: "11"
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(15 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 15
	}
};

//log.info("tentative_petter.js LOADED");

// generated ok (NO DATE)
