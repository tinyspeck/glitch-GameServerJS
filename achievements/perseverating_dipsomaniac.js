var name		= "Perseverating Dipsomaniac";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Maintained a solid buzz for 10 straight minutes, for no discernable reason whatsoever";
var status_text		= "It takes endurance, focus and a certain sort of random single-mindedness to maintain a buzz for no apparent reason for 10 minutes. Clearly, you have all three of these qualities, earning you the title Perseverating Dipsomaniac.";
var last_published	= 1348802210;
var is_shareworthy	= 1;
var url		= "perseverating-dipsomaniac";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/perseverating_dipsomaniac_1315685889.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/perseverating_dipsomaniac_1315685889_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/perseverating_dipsomaniac_1315685889_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/perseverating_dipsomaniac_1315685889_40.png";
function on_apply(pc){
	
}
var conditions = {
	482 : {
		type	: "counter",
		group	: "buff_times",
		label	: "buzzed",
		value	: "10"
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
	pc.stats_add_favor_points("friendly", round_to_5(20 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 20
	}
};

//log.info("perseverating_dipsomaniac.js LOADED");

// generated ok (NO DATE)
