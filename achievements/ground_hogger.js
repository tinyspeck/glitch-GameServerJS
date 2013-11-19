var name		= "Ground Hogger";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Rode the subway rails 103 times";
var status_text		= "Your commitment to public transit is noble, civic-minded, and deserves a better reward than this Ground Hogger badge. But there you have it.";
var last_published	= 1348798876;
var is_shareworthy	= 1;
var url		= "ground-hogger";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/ground_hogger_1315686088.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/ground_hogger_1315686088_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/ground_hogger_1315686088_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/ground_hogger_1315686088_40.png";
function on_apply(pc){
	
}
var conditions = {
	554 : {
		type	: "counter",
		group	: "transit",
		label	: "subways_entered",
		value	: "103"
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
	pc.stats_add_favor_points("lem", round_to_5(60 * multiplier));
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
		"giant"		: "lem",
		"points"	: 60
	}
};

//log.info("ground_hogger.js LOADED");

// generated ok (NO DATE)
