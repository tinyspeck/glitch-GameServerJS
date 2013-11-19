var name		= "Metal Masseuse";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Smelted 283 Metal Ingots from purest Metal Rock";
var status_text		= "You may not consider employing your smelter a matter of massage, but smelt Metal Rocks into 283 ingots, and we award you a Metal Masseuse badge.";
var last_published	= 1348801872;
var is_shareworthy	= 1;
var url		= "metal-masseuse";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/metal_masseuse_1315686078.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/metal_masseuse_1315686078_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/metal_masseuse_1315686078_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/metal_masseuse_1315686078_40.png";
function on_apply(pc){
	
}
var conditions = {
	550 : {
		type	: "counter",
		group	: "smelter",
		label	: "ingots_created",
		value	: "283"
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 60
	}
};

//log.info("metal_masseuse.js LOADED");

// generated ok (NO DATE)
