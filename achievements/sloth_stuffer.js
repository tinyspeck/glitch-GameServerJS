var name		= "Sloth Stuffer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Fed a single sloth until it was full";
var status_text		= "Just when you thought those sloths could keep ramming rods into their gaping maws forever, you managed to fill one up entirely. Mazel tov! You stuffed a sloth!";
var last_published	= 1348802586;
var is_shareworthy	= 1;
var url		= "sloth-stuffer";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/sloth_stuffer_1339701261.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/sloth_stuffer_1339701261_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/sloth_stuffer_1339701261_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/sloth_stuffer_1339701261_40.png";
function on_apply(pc){
	
}
var conditions = {
	765 : {
		type	: "counter",
		group	: "sloth",
		label	: "fed_until_full",
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 40
	}
};

//log.info("sloth_stuffer.js LOADED");

// generated ok (NO DATE)
