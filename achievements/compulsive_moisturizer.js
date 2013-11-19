var name		= "Compulsive Moisturizer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Wetly watered 127 Egg Plants";
var status_text		= "Without people like you, Egg Plants would grow tiny desiccated egg-shaped nubbins, filled with egg-flavored powder. But you, and other Compulsive Moisturizers like you ensure the inside of every egg is runny, ripe, and ready to eat. Badged!";
var last_published	= 1349461087;
var is_shareworthy	= 1;
var url		= "compulsive-moisturizer";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/compulsive_moisturizer_1304984743.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/compulsive_moisturizer_1304984743_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/compulsive_moisturizer_1304984743_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/compulsive_moisturizer_1304984743_40.png";
function on_apply(pc){
	
}
var conditions = {
	344 : {
		type	: "counter",
		group	: "trants_watered",
		label	: "trant_egg",
		value	: "127"
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

//log.info("compulsive_moisturizer.js LOADED");

// generated ok (NO DATE)
