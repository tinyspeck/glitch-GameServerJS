var name		= "Bounder, Untenured";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Jumped exactly 1,111 times";
var status_text		= "Can you believe it? We've been keeping track of how many times you've jumped, and it's a lot! Consider yourself an Untenured Bounder. But you're on the fast track, friend.";
var last_published	= 1323922981;
var is_shareworthy	= 0;
var url		= "bounder-untenured";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/bounder_untenured_1315685830.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/bounder_untenured_1315685830_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/bounder_untenured_1315685830_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/bounder_untenured_1315685830_40.png";
function on_apply(pc){
	
}
var conditions = {
	469 : {
		type	: "counter",
		group	: "movement",
		label	: "jumped",
		value	: "1111"
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(15 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 15
	}
};

//log.info("bounder_untenured.js LOADED");

// generated ok (NO DATE)
