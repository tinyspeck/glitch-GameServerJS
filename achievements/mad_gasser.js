var name		= "Mad Gasser";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Futzed around with each kind of gas";
var status_text		= "Gases are unpredictable, but you've sniffed, shaken and smashed your way through a lot of them. You deserve this Mad Gasser badge.";
var last_published	= 1352766246;
var is_shareworthy	= 1;
var url		= "mad-gasser";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/mad_gasser_1304983683.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/mad_gasser_1304983683_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/mad_gasser_1304983683_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/mad_gasser_1304983683_40.png";
function on_apply(pc){
	
}
var conditions = {
	153 : {
		type	: "counter",
		group	: "helium",
		label	: "inhale",
		value	: "1"
	},
	154 : {
		type	: "counter",
		group	: "laughing_gas",
		label	: "uncork",
		value	: "1"
	},
	155 : {
		type	: "counter",
		group	: "general_vapour",
		label	: "shake",
		value	: "1"
	},
	156 : {
		type	: "counter",
		group	: "crying_gas",
		label	: "sniff",
		value	: "1"
	},
	157 : {
		type	: "counter",
		group	: "heavy_gas",
		label	: "lift",
		value	: "1"
	},
	158 : {
		type	: "counter",
		group	: "white_gas",
		label	: "smash",
		value	: "1"
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 20
	}
};

//log.info("mad_gasser.js LOADED");

// generated ok (NO DATE)
