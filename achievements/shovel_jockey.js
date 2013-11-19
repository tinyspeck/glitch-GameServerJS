var name		= "Shovel Jockey";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Shovel 29 times to dig Patches or Dirt Piles";
var status_text		= "You are one dogged digger. In honour of your skuldiggery, here's a Shovel Jockey badge.";
var last_published	= 1336502234;
var is_shareworthy	= 0;
var url		= "shovel-jockey";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/shovel_jockey_1315685957.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/shovel_jockey_1315685957_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/shovel_jockey_1315685957_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/shovel_jockey_1315685957_40.png";
function on_apply(pc){
	
}
var conditions = {
	505 : {
		type	: "counter",
		group	: "dug",
		label	: "dirt",
		value	: "29"
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 20
	}
};

//log.info("shovel_jockey.js LOADED");

// generated ok (NO DATE)
