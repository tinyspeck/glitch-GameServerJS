var name		= "Ice Ice Baby";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Scraped 227 Ice from Ice Nubbins";
var status_text		= "Stop! Collaborate and listen! You coolly scraped 227 wild ice from wild ice nubbins. 227 Ice?!? Ice, ICE baby! Woah! Word to your mother!";
var last_published	= 1351708128;
var is_shareworthy	= 1;
var url		= "ice-ice-baby";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/ice_ice_baby_1351618914.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/ice_ice_baby_1351618914_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/ice_ice_baby_1351618914_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/ice_ice_baby_1351618914_40.png";
function on_apply(pc){
	
}
var conditions = {
	860 : {
		type	: "counter",
		group	: "ice",
		label	: "ice_received",
		value	: "227"
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 40
	}
};

//log.info("ice_ice_baby.js LOADED");

// generated ok (NO DATE)
