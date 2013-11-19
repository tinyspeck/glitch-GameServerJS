var name		= "Loamist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Shovel 127 times to dig Patches or Dirt Piles";
var status_text		= "This makes 127 Patches or Dirt Piles you've dug. Celebrate this unearthly experience with this here Loamist badge.";
var last_published	= 1348801507;
var is_shareworthy	= 1;
var url		= "loamist";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/loamist_1315685962.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/loamist_1315685962_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/loamist_1315685962_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/loamist_1315685962_40.png";
function on_apply(pc){
	
}
var conditions = {
	507 : {
		type	: "counter",
		group	: "dug",
		label	: "dirt",
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 50
	}
};

//log.info("loamist.js LOADED");

// generated ok (NO DATE)
