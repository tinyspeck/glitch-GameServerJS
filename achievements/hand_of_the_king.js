var name		= "Hand of the King";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Had the Crown for 25013 seconds";
var status_text		= "Few can say they've spent longer in presence of the crown than you. Not quite a monarch of the crown-caressment community, having had it for 25013 seconds, you're second only to the supreme ruler. Thou art truly: The Hand of the King.";
var last_published	= 1348798891;
var is_shareworthy	= 1;
var url		= "hand-of-the-king";
var category		= "games";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/hand_of_the_king_1315512119.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/hand_of_the_king_1315512119_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/hand_of_the_king_1315512119_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/hand_of_the_king_1315512119_40.png";
function on_apply(pc){
	
}
var conditions = {
	585 : {
		type	: "counter",
		group	: "it_game",
		label	: "seconds_with_crown",
		value	: "25013"
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 200
	}
};

//log.info("hand_of_the_king.js LOADED");

// generated ok (NO DATE)
