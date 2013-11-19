var name		= "Spent First Emblem of Cosma";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Earned the ability to acquire Meditative Arts III, the serenest of all the Meditative arts";
var status_text		= "Feeling serene? Now you can get serener! With the unlocking of this emblem, you can acquire Meditative Arts III, which, to be frank, makes Meditative Arts I and II look kind of sick.";
var last_published	= 1323915864;
var is_shareworthy	= 0;
var url		= "spent-first-emblem-of-cosma";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/emblem_skill_unlock_cosma_1_1304984997.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/emblem_skill_unlock_cosma_1_1304984997_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/emblem_skill_unlock_cosma_1_1304984997_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/emblem_skill_unlock_cosma_1_1304984997_40.png";
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

//log.info("emblem_skill_unlock_cosma_1.js LOADED");

// generated ok (NO DATE)
