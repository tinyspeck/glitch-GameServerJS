var name		= "Promising Lush";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Wet your whistle 7 times";
var status_text		= "You're not a full-blown dipsomaniac yet, but you've taken the first crucial steps toward it, and earned yourself a Promising Lush badge. I'll drink to that. Or, more likely, you will.";
var last_published	= 1349460895;
var is_shareworthy	= 1;
var url		= "promising-lush";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/promising_lush_1304983578.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/promising_lush_1304983578_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/promising_lush_1304983578_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/promising_lush_1304983578_40.png";
function on_apply(pc){
	
}
var conditions = {
	419 : {
		type	: "counter",
		group	: "items_drank",
		label	: "alcohol",
		value	: "7"
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

//log.info("promising_lush.js LOADED");

// generated ok (NO DATE)
