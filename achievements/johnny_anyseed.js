var name		= "Johnny Anyseed";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Planted 37 Seasoned Beans";
var status_text		= "You've spilled your beans far and wide. You've earned the title Johnny Anyseed.";
var last_published	= 1348801453;
var is_shareworthy	= 1;
var url		= "johnny-anyseed";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/johnny_anyseed_1304983813.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/johnny_anyseed_1304983813_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/johnny_anyseed_1304983813_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/johnny_anyseed_1304983813_40.png";
function on_apply(pc){
	
}
var conditions = {
	182 : {
		type	: "group_sum",
		group	: "VERB:plant",
		value	: "37"
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
	pc.stats_add_favor_points("spriggan", round_to_5(75 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 75
	}
};

//log.info("johnny_anyseed.js LOADED");

// generated ok (NO DATE)
