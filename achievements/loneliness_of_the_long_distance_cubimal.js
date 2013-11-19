var name		= "The Loneliness of the Long Distance Cubimal";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Raced a cubimal to an astounding 8.9 planks";
var status_text		= "It's hard for the long distance cubimal, pounding the ground, step after gruelling tiny step, nothing but the sound of your whirring clockwork innards for company, striving to reach the mystical marathon distance of 8.9 planks. Finally, you did it! Well, your cubimal did. But they're your cubimal: yay YOU!";
var last_published	= 1348801518;
var is_shareworthy	= 1;
var url		= "loneliness-of-the-long-distance-cubimal";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-20\/loneliness_of_the_long_distance_cubimal_1340238848.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-20\/loneliness_of_the_long_distance_cubimal_1340238848_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-20\/loneliness_of_the_long_distance_cubimal_1340238848_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-20\/loneliness_of_the_long_distance_cubimal_1340238848_40.png";
function on_apply(pc){
	
}
var conditions = {
	782 : {
		type	: "counter",
		group	: "cubimals_raced",
		label	: "long_distance",
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
	pc.stats_add_xp(round_to_5(350 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 350,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 60
	}
};

//log.info("loneliness_of_the_long_distance_cubimal.js LOADED");

// generated ok (NO DATE)
