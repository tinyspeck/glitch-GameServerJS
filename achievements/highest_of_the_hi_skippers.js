var name		= "The Speedhermit";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "Set an ALL-TIME record in a location for Hi-Sign evasion";
var status_text		= "Others may have run from social contact, but none ran as fast, or for as long, as you. You fiercely retained your lone wolf status for longer than anyone had ever done in that location before. Keep on keeping on, you rugged Speedhermit, you!";
var last_published	= 1352412800;
var is_shareworthy	= 1;
var url		= "speedhermit";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/highest_of_the_hi_skippers_1352250661.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/highest_of_the_hi_skippers_1352250661_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/highest_of_the_hi_skippers_1352250661_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/highest_of_the_hi_skippers_1352250661_40.png";
function on_apply(pc){
	
}
var conditions = {
	870 : {
		type	: "counter",
		group	: "alltime_evasion_record",
		label	: "set",
		value	: "1"
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "all",
		"points"	: 25
	}
};

//log.info("highest_of_the_hi_skippers.js LOADED");

// generated ok (NO DATE)
