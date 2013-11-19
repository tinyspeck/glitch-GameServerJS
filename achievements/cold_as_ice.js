var name		= "Cold as Ice";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Chillily scraped 877 Ice from the Nubbin";
var status_text		= "You're as Cold As Ice, you're willing to scrape the ice for cubes. 877 of them, in fact. Aw yeah.";
var last_published	= 1351708138;
var is_shareworthy	= 1;
var url		= "cold-as-ice";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/cold_as_ice_1351618922.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/cold_as_ice_1351618922_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/cold_as_ice_1351618922_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-30\/cold_as_ice_1351618922_40.png";
function on_apply(pc){
	
}
var conditions = {
	862 : {
		type	: "counter",
		group	: "ice",
		label	: "ice_received",
		value	: "877"
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 150
	}
};

//log.info("cold_as_ice.js LOADED");

// generated ok (NO DATE)
