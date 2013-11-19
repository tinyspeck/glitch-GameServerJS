var name		= "Rumrunner";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Dramatically distilled 61 Hooches in your back yard";
var status_text		= "Under a veil of secrecy and a blanket of moral fog, you stealthily distilled 61 Hooches. What happened to them then, you say, is none of your concern. Unless you drank them yourself. In which case, Cheers!";
var last_published	= 1348802497;
var is_shareworthy	= 1;
var url		= "rumrunner";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/rumrunner_1321576670.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/rumrunner_1321576670_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/rumrunner_1321576670_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/rumrunner_1321576670_40.png";
function on_apply(pc){
	
}
var conditions = {
	635 : {
		type	: "counter",
		group	: "still",
		label	: "collected_in_pol",
		value	: "61"
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
	pc.stats_add_favor_points("friendly", round_to_5(40 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 40
	}
};

//log.info("rumrunner.js LOADED");

// generated ok (NO DATE)
