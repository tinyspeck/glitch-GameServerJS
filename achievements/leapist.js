var name		= "Leapist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Jumped exactly 11,111 times";
var status_text		= "Congratulations. You are now a board-certified Leapist. With springs in your feet and a song in your heart, there isn't much that can keep you down. Except maybe an anvil.";
var last_published	= 1348801482;
var is_shareworthy	= 1;
var url		= "leapist";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/leapist_1315685833.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/leapist_1315685833_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/leapist_1315685833_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/leapist_1315685833_40.png";
function on_apply(pc){
	
}
var conditions = {
	470 : {
		type	: "counter",
		group	: "movement",
		label	: "jumped",
		value	: "11111"
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
	pc.stats_add_xp(round_to_5(555 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(55 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 555,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 55
	}
};

//log.info("leapist.js LOADED");

// generated ok (NO DATE)
