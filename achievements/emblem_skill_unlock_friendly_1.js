var name		= "Spent First Emblem of Friendly";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Earned the right to learn the hallowed secrets of Cocktail Crafting II";
var status_text		= "The hallowed secrets of Cocktail Crafting II are shared only with the select few who unlock the First Emblem of Friendly. Should you choose to acquire this skill, you will learn to make drinks of mind-boggling fanciness and fancy-boggling mindfulness.";
var last_published	= 1323915869;
var is_shareworthy	= 0;
var url		= "spent-first-emblem-of-friendly";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/emblem_skill_unlock_friendly_1_1304985002.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/emblem_skill_unlock_friendly_1_1304985002_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/emblem_skill_unlock_friendly_1_1304985002_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/emblem_skill_unlock_friendly_1_1304985002_40.png";
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

//log.info("emblem_skill_unlock_friendly_1.js LOADED");

// generated ok (NO DATE)
