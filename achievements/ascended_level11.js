var name		= "Beta Cherub";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "When the time of the Great Reset came, you had reached at least level 11. Then you ascended, and history will remember you forever.";
var status_text		= "In the ranks of glory, you will be remembered forever as one of the ones who helped paved the way for all the other Glitches that followed, and, what's more, reached a double digit level while doing it. Kudos, little Beta Cherub.";
var last_published	= 1323923880;
var is_shareworthy	= 0;
var url		= "ascended-level11";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level11_1316136873.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level11_1316136873_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level11_1316136873_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level11_1316136873_40.png";
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

//log.info("ascended_level11.js LOADED");

// generated ok (NO DATE)
