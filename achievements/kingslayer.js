var name		= "Kingslayer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Had the Crown for 12007 seconds";
var status_text		= "Do peasants tremble as you pass? Probably because they've heard of your meteoric rise through the ranks, laying waste to all around you, and holding the crown for a mighty 12007 seconds. Thou dost truly deserve the name: Kingslayer.";
var last_published	= 1348801465;
var is_shareworthy	= 1;
var url		= "kingslayer";
var category		= "games";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/kingslayer_1315512117.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/kingslayer_1315512117_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/kingslayer_1315512117_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/kingslayer_1315512117_40.png";
function on_apply(pc){
	
}
var conditions = {
	584 : {
		type	: "counter",
		group	: "it_game",
		label	: "seconds_with_crown",
		value	: "12007"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 150
	}
};

//log.info("kingslayer.js LOADED");

// generated ok (NO DATE)
