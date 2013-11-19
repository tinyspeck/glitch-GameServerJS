var name		= "Pop Idol";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "Pulled 13 Glitchmas Crackers";
var status_text		= "Strong of wrist and strong of nerve, you've managed to withstand the excitement of 13 tiny explosions and risked the victorious rush (or crash of disappointment) of pulling 13 Glitchmas Crackers, and earned yourself a badge for it. POP!!! Times 13!";
var last_published	= 1348802231;
var is_shareworthy	= 1;
var url		= "pop-idol";
var category		= "seasonal";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-20\/pop_star_1324407015.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-20\/pop_star_1324407015_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-20\/pop_star_1324407015_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-20\/pop_star_1324407015_40.png";
function on_apply(pc){
	
}
var conditions = {
	664 : {
		type	: "counter",
		group	: "glitchmas_cracker",
		label	: "opened",
		value	: "13"
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(13 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "all",
		"points"	: 13
	}
};

//log.info("pop_star.js LOADED");

// generated ok (NO DATE)
