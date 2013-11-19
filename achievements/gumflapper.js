var name		= "Gumflapper";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Chatted with 3 different players";
var status_text		= "You've got a way with words. You've earned a Gumflapper badge!";
var last_published	= 1323924518;
var is_shareworthy	= 0;
var url		= "gumflapper";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/gumflapper_1316406750.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/gumflapper_1316406750_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/gumflapper_1316406750_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/gumflapper_1316406750_40.png";
function on_apply(pc){
	
}
var conditions = {
	216 : {
		type	: "group_count",
		group	: "talked_to",
		value	: "3"
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
	pc.stats_add_xp(round_to_5(75 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 75,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 10
	}
};

//log.info("gumflapper.js LOADED");

// generated ok (NO DATE)
