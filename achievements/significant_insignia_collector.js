var name		= "Significant Insignia Collector";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Painstakingly earned 17 Emblems of the Giants";
var status_text		= "Righteous. Your Emblem collection is a thing of beauty. Not huge, nor terribly awesome, but notable. Reflect on where you go from here as you stroke your Significant Insignia Collector badge.";
var last_published	= 1348802563;
var is_shareworthy	= 1;
var url		= "significant-insignia-collector";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/significant_insignia_collector_1304984773.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/significant_insignia_collector_1304984773_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/significant_insignia_collector_1304984773_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/significant_insignia_collector_1304984773_40.png";
function on_apply(pc){
	
}
var conditions = {
	350 : {
		type	: "group_sum",
		group	: "emblems_acquired",
		value	: "17"
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
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800
};

//log.info("significant_insignia_collector.js LOADED");

// generated ok (NO DATE)
