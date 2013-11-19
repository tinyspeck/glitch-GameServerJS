var name		= "Silver Gristle Award";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Pigged out on 251 meats";
var status_text		= "Hot dog! You've really pigged out. You win a carnelicious Silver Gristle Award.";
var last_published	= 1348802570;
var is_shareworthy	= 1;
var url		= "silver-gristle-award";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/silver_gristle_award_1304983511.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/silver_gristle_award_1304983511_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/silver_gristle_award_1304983511_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/silver_gristle_award_1304983511_40.png";
function on_apply(pc){
	
}
var conditions = {
	56 : {
		type	: "counter",
		group	: "items_eaten",
		label	: "meat",
		value	: "251"
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 100
	}
};

//log.info("silver_gristle_award.js LOADED");

// generated ok (NO DATE)
