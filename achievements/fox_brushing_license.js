var name		= "Licensed To Brush Foxes";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "Congrats! You are now licensed to brush foxes.";
var status_text		= "Congrats! You are now licensed to brush foxes.";
var last_published	= 1351118010;
var is_shareworthy	= 1;
var url		= "fox-brushing-license";
var category		= "player ability";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-19\/fox_brushing_license_1334869596.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-19\/fox_brushing_license_1334869596_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-19\/fox_brushing_license_1334869596_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-19\/fox_brushing_license_1334869596_40.png";
function on_apply(pc){
	
}
var conditions = {
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
}
var rewards = {};

//log.info("fox_brushing_license.js LOADED");

// generated ok (NO DATE)
