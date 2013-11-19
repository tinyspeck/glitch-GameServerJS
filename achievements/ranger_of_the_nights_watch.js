var name		= "Ranger of the Night's Watch";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Had the Crown for 1001 seconds";
var status_text		= "In the battle for the crown, you've shown an ever-vigilant commitment to keeping your eye on the goal and your mitts on the metal. Thus have you attained the first level of crown-protectorate: Arise, Ranger of the Night's Watch.";
var last_published	= 1348802477;
var is_shareworthy	= 1;
var url		= "ranger-of-the-nights-watch";
var category		= "games";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/ranger_of_the_nights_watch_1315512111.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/ranger_of_the_nights_watch_1315512111_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/ranger_of_the_nights_watch_1315512111_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/ranger_of_the_nights_watch_1315512111_40.png";
function on_apply(pc){
	
}
var conditions = {
	582 : {
		type	: "counter",
		group	: "it_game",
		label	: "seconds_with_crown",
		value	: "1001"
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
	pc.stats_add_xp(round_to_5(350 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(45 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 350,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 45
	}
};

//log.info("ranger_of_the_nights_watch.js LOADED");

// generated ok (NO DATE)
