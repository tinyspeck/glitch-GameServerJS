var name		= "Ice Baby";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Cooly scraped 67 Ice from Ice Nubbins";
var status_text		= "Risking goosepimples and a decidedly chilly undercarriage, you strode into the frozen badlands and scraped 67 Ice from Ice Nubbins. You're a baby in the ice-scraping world, but hey: look at all that ice, Ice Baby!";
var last_published	= 1351708124;
var is_shareworthy	= 1;
var url		= "ice-baby";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/ice_baby_1351618910.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/ice_baby_1351618910_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/ice_baby_1351618910_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/ice_baby_1351618910_40.png";
function on_apply(pc){
	
}
var conditions = {
	859 : {
		type	: "counter",
		group	: "ice",
		label	: "ice_received",
		value	: "67"
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 20
	}
};

//log.info("ice_baby.js LOADED");

// generated ok (NO DATE)
