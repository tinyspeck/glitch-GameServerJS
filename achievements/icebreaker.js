var name		= "Icebreaker";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Scraped free 1777 Ice from Ice Nubbins";
var status_text		= "You're proud, confident, you've got a scraper, and you know at least two ways to use it. You're a cool calm Icebreaker: and precisely the kind of person everyone wants at parties. YEAH.";
var last_published	= 1351708142;
var is_shareworthy	= 1;
var url		= "icebreaker";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/icebreaker_1351618927.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/icebreaker_1351618927_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/icebreaker_1351618927_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/icebreaker_1351618927_40.png";
function on_apply(pc){
	
}
var conditions = {
	863 : {
		type	: "counter",
		group	: "ice",
		label	: "ice_received",
		value	: "1777"
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
	pc.stats_add_xp(round_to_5(1200 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(250 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1200,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 250
	}
};

//log.info("icebreaker.js LOADED");

// generated ok (NO DATE)
