var name		= "Dirtomancer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Shovel 251 times to dig Patches or Dirt Piles";
var status_text		= "Walk softly and carry a big shovel. If you knew how to embroider, that phrase would look mighty nice on a pillow. In lieu of a pillow, please accept this Dirtomancer badge.";
var last_published	= 1348797469;
var is_shareworthy	= 1;
var url		= "dirtomancer";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dirtomancer_1315685964.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dirtomancer_1315685964_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dirtomancer_1315685964_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dirtomancer_1315685964_40.png";
function on_apply(pc){
	
}
var conditions = {
	508 : {
		type	: "counter",
		group	: "dug",
		label	: "dirt",
		value	: "251"
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(75 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 75
	}
};

//log.info("dirtomancer.js LOADED");

// generated ok (NO DATE)
