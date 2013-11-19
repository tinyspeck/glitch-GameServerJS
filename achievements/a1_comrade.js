var name		= "A-1 Comrade";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Made 79 friends";
var status_text		= "You're a friend in need and a friend in deed. You've earned the title A-1 Comrade.";
var last_published	= 1348796025;
var is_shareworthy	= 1;
var url		= "a1-comrade";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-14\/a1_comrade_1316061695.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-14\/a1_comrade_1316061695_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-14\/a1_comrade_1316061695_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-14\/a1_comrade_1316061695_40.png";
function on_apply(pc){
	
}
var conditions = {
	214 : {
		type	: "counter",
		group	: "player",
		label	: "buddies_count",
		value	: "79"
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
	pc.stats_add_favor_points("friendly", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 50
	}
};

//log.info("a1_comrade.js LOADED");

// generated ok (NO DATE)
