var name		= "Archistratege of Beta";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "When the time of the Great Reset came, you had reached at least level 83. Then you ascended, and entered the canon of Glitchian rumorlore.";
var status_text		= "Above the Archangels, in the realms of Ur's atmosphere where only the Giants, the devs, and possibly Clare could see the top of your Glitchy little head, you rose to the level of Archistratege of Beta before having your mighty wings clipped by The Great Reset (only to rise again).";
var last_published	= 1323923895;
var is_shareworthy	= 0;
var url		= "ascended-level83";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_level83_1315970790.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_level83_1315970790_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_level83_1315970790_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_level83_1315970790_40.png";
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

//log.info("ascended_level83.js LOADED");

// generated ok (NO DATE)
