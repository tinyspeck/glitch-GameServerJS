var name		= "Archangel of Beta";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "When the time of the Great Reset came, you had reached at least level 61. Then you ascended, and entered the realms of Glitchian legend.";
var status_text		= "In the mists of future, Glitchistorians will look back at the era known as 'Before The Sooooooon', and only dare to whisper the names of those who made it to the level of Archangel before the Great Reset came. Yours will be one of those names.";
var last_published	= 1323923892;
var is_shareworthy	= 0;
var url		= "ascended-level61";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level61_1316136886.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level61_1316136886_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level61_1316136886_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level61_1316136886_40.png";
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

//log.info("ascended_level61.js LOADED");

// generated ok (NO DATE)
