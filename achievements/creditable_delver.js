var name		= "Creditable Delver";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Mined for ore 53 times";
var status_text		= "You've come a long way since you first picked up your pick. It's safe to say you've earned the title Creditable Delver.";
var last_published	= 1323922492;
var is_shareworthy	= 0;
var url		= "creditable-delver";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/creditable_delver_1304983908.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/creditable_delver_1304983908_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/creditable_delver_1304983908_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/creditable_delver_1304983908_40.png";
function on_apply(pc){
	
}
var conditions = {
	199 : {
		type	: "group_sum",
		group	: "nodes_mined",
		value	: "53"
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 25
	}
};

//log.info("creditable_delver.js LOADED");

// generated ok (NO DATE)
