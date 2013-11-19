var name		= "Spent First Emblem of Spriggan";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gained the ability to learn the verdant arts of Arborology III";
var status_text		= "By the power of Spriggan's Watering Can, with this unlocking the verdant inner sanctum of Arborology III now beckons you with its, um, verdancy.";
var last_published	= 1336499010;
var is_shareworthy	= 0;
var url		= "spent-first-emblem-of-spriggan";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/emblem_skill_unlock_spriggan_1_1336503383.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/emblem_skill_unlock_spriggan_1_1336503383_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/emblem_skill_unlock_spriggan_1_1336503383_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/emblem_skill_unlock_spriggan_1_1336503383_40.png";
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

//log.info("emblem_skill_unlock_spriggan_1.js LOADED");

// generated ok (NO DATE)
