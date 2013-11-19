var name		= "Dirt Monkey";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Shovel 61 times to dig Patches or Dirt Piles";
var status_text		= "Remember all those times your mom told you not to monkey around in the dirt? Show her this badge and tell her it's okay now.";
var last_published	= 1336502242;
var is_shareworthy	= 0;
var url		= "dirt-monkey";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dirt_monkey_1315685959.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dirt_monkey_1315685959_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dirt_monkey_1315685959_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dirt_monkey_1315685959_40.png";
function on_apply(pc){
	
}
var conditions = {
	506 : {
		type	: "counter",
		group	: "dug",
		label	: "dirt",
		value	: "61"
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(30 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 30
	}
};

//log.info("dirt_monkey.js LOADED");

// generated ok (NO DATE)
