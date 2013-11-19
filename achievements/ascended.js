var name		= "Ascended";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "You ascended at the time of the Great Reset. Future glitcheologists will know one thing: in the beginning, you were there.";
var status_text		= "You ascended! Congrats! Way into the future, when Glitcheologists look back upon this time, many things will be a mystery. But if nothing else, this badge will make one thing clear to them: In the beginning, there was you.";
var last_published	= 1323923878;
var is_shareworthy	= 0;
var url		= "ascended";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_1315970774.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_1315970774_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_1315970774_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_1315970774_40.png";
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

//log.info("ascended.js LOADED");

// generated ok (NO DATE)
