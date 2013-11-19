var name		= "Pumpkin Carver";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Carved the full collection of Pumpkins";
var status_text		= "You sharpened your sharp things, and brought life to large vegetables. Or at least faces. Weird gurning faces that smell of burning vegetables when you fill them with Fireflies. Yay you!";
var last_published	= 1348802272;
var is_shareworthy	= 1;
var url		= "pumpkin-carver";
var category		= "seasonal";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/pumpkin_carver_1319680213.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/pumpkin_carver_1319680213_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/pumpkin_carver_1319680213_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/pumpkin_carver_1319680213_40.png";
function on_apply(pc){
	
}
var conditions = {
	622 : {
		type	: "group_count",
		group	: "pumpkins_carved",
		value	: "5"
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 40
	}
};

//log.info("pumpkin_carver.js LOADED");

// generated ok (NO DATE)
