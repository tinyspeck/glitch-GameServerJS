var name		= "Better-Than-Lousy Douser";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Dispensed a good watering to 41 Bean Trees";
var status_text		= "When you water a Bean Tree, it stays watered. For a while, anyway. You deserve our second-finest Bean Tree watering honour: the title Better-Than-Lousy Douser.";
var last_published	= 1323925576;
var is_shareworthy	= 0;
var url		= "betterthanlousy-douser";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/betterthanlousy_douser_1304984704.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/betterthanlousy_douser_1304984704_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/betterthanlousy_douser_1304984704_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/betterthanlousy_douser_1304984704_40.png";
function on_apply(pc){
	
}
var conditions = {
	337 : {
		type	: "counter",
		group	: "trants_watered",
		label	: "trant_bean",
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

//log.info("betterthanlousy_douser.js LOADED");

// generated ok (NO DATE)
