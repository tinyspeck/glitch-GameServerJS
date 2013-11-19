var name		= "Dirt Diggler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Shovel 503 times to dig Patches or Dirt Piles";
var status_text		= "Digging up 503 Patches or piles of dirt yields a lot of Earth, the odd bit of Loam, the coveted title Dirt Diggler, and a question: Are you ever planning to wash your hands?";
var last_published	= 1348797477;
var is_shareworthy	= 1;
var url		= "dirt-diggler";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dirt_diggler_1315685966.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dirt_diggler_1315685966_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dirt_diggler_1315685966_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dirt_diggler_1315685966_40.png";
function on_apply(pc){
	
}
var conditions = {
	509 : {
		type	: "counter",
		group	: "dug",
		label	: "dirt",
		value	: "503"
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(175 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 175
	}
};

//log.info("dirt_diggler.js LOADED");

// generated ok (NO DATE)
