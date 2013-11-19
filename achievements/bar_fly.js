var name		= "Bar Fly";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Turned 57 metal bars";
var status_text		= "You brought the metal. And then you turned it into 57 metal bars. You're FLY, Sly, and no mistake. You're fly and you made bars. Have a badge, Bar Fly!";
var last_published	= 1348796746;
var is_shareworthy	= 1;
var url		= "bar-fly";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/bar_fly_1339698244.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/bar_fly_1339698244_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/bar_fly_1339698244_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/bar_fly_1339698244_40.png";
function on_apply(pc){
	
}
var conditions = {
	696 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "280",
		value	: "57"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 100
	}
};

//log.info("bar_fly.js LOADED");

// generated ok (NO DATE)
