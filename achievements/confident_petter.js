var name		= "Confident Petter";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Confidently petted 41 Spice Plants";
var status_text		= "It takes a confident person to pet 41 Spice Plants. That's probably why the award you've just earned is called the Confident Petter badge. Just a guess.";
var last_published	= 1338931285;
var is_shareworthy	= 0;
var url		= "confident-petter";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/confident_petter_1304984588.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/confident_petter_1304984588_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/confident_petter_1304984588_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/confident_petter_1304984588_40.png";
function on_apply(pc){
	
}
var conditions = {
	319 : {
		type	: "counter",
		group	: "trants_petted",
		label	: "trant_spice",
		value	: "41"
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

//log.info("confident_petter.js LOADED");

// generated ok (NO DATE)
