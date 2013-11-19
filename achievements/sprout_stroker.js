var name		= "Sprout Stroker";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Administered a sound petting to 11 Gas Plants";
var status_text		= "For a newcomer to the field of Gas Plant petting, you've done an impressive job. You are hereby awarded the designation Sprout Stroker!";
var last_published	= 1338931264;
var is_shareworthy	= 0;
var url		= "sprout-stroker";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/sprout_stroker_1304984549.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/sprout_stroker_1304984549_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/sprout_stroker_1304984549_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/sprout_stroker_1304984549_40.png";
function on_apply(pc){
	
}
var conditions = {
	313 : {
		type	: "counter",
		group	: "trants_petted",
		label	: "trant_gas",
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

//log.info("sprout_stroker.js LOADED");

// generated ok (NO DATE)
