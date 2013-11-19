var name		= "Hypersupermagic Clareangel";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "When the time of the Great Reset came, you had reached at least level 101. Then you ascended, resplendent, and entered the Glitch Hall of WIN.";
var status_text		= "In the beginning of time, the rank of Hypersupermagic Clareangel was created for those who reached higher than Level 101 during Beta. It was never expected to be claimed. Then you came along. Lucky, eh? Yes, the name is merely a fortuitous coincidence. Honest.";
var last_published	= 1323923898;
var is_shareworthy	= 0;
var url		= "ascended-level101";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_level101_1315970792.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_level101_1315970792_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_level101_1315970792_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_level101_1315970792_40.png";
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

//log.info("ascended_level101.js LOADED");

// generated ok (NO DATE)
