var name		= "Junior Irrigationist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Wetly watered 11 Egg Plants";
var status_text		= "A wet Egg Plant is a happy Egg Plant. Unless it's too wet. For maintaining optimal wetness on 11 Egg Plants, you've earned the title Junior Irrigationist.";
var last_published	= 1349313886;
var is_shareworthy	= 1;
var url		= "junior-irrigationist";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/junior_irrigationist_1304984676.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/junior_irrigationist_1304984676_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/junior_irrigationist_1304984676_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/junior_irrigationist_1304984676_40.png";
function on_apply(pc){
	
}
var conditions = {
	332 : {
		type	: "counter",
		group	: "trants_watered",
		label	: "trant_egg",
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

//log.info("junior_irrigationist.js LOADED");

// generated ok (NO DATE)
