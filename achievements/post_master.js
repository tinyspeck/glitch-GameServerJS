var name		= "Post Master (General)";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Turned out 103 Wood Posts";
var status_text		= "Before you started, there were 103 fewer posts in the world. Now there are 103 more. What for? Who knows. But that's why you're the master of posts, general division. Well done, Post Master (General)!";
var last_published	= 1348802242;
var is_shareworthy	= 1;
var url		= "post-master";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/post_master_1339717553.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/post_master_1339717553_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/post_master_1339717553_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/post_master_1339717553_40.png";
function on_apply(pc){
	
}
var conditions = {
	693 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "277",
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(65 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 65
	}
};

//log.info("post_master.js LOADED");

// generated ok (NO DATE)
