var name		= "Ace of Om";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Practiced meditation for a sum total of 23 minutes";
var status_text		= "You've spent a total of 23 minutes meditating. As a newly minted Ace of Om, you're on the pathway to nirvana. We hope you packed a lunch.";
var last_published	= 1348796041;
var is_shareworthy	= 1;
var url		= "ace-of-om";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/ace_of_om_1315686035.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/ace_of_om_1315686035_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/ace_of_om_1315686035_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/ace_of_om_1315686035_40.png";
function on_apply(pc){
	
}
var conditions = {
	534 : {
		type	: "counter",
		group	: "focusing_orb",
		label	: "meditation_time",
		value	: "23"
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
	pc.stats_add_favor_points("cosma", round_to_5(10 * multiplier));
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
		"giant"		: "cosma",
		"points"	: 10
	}
};

//log.info("ace_of_om.js LOADED");

// generated ok (NO DATE)
