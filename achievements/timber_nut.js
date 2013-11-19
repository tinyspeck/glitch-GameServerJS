var name		= "Timber Nut";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Petted and watered 103 Wood Trees to the full woody bloom of adulthood";
var status_text		= "With 103 Wood trees watered and petted to maturity, you are what we call a Timber Nut around these parts. That's mostly a good thing. Mostly.";
var last_published	= 1323933333;
var is_shareworthy	= 0;
var url		= "timber-nut";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/timber_nut_1315686033.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/timber_nut_1315686033_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/timber_nut_1315686033_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/timber_nut_1315686033_40.png";
function on_apply(pc){
	
}
var conditions = {
	533 : {
		type	: "counter",
		group	: "wood_tree",
		label	: "maxed",
		value	: "103"
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

//log.info("timber_nut.js LOADED");

// generated ok (NO DATE)
