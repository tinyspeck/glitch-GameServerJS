var name		= "Spent First Emblem of Mab";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Earned the privilege of learning Soil Appreciation IV";
var status_text		= "Ambitious soil appreciators know that unlocking the First Emblem of Mab is a crucial step. If you're prepared to get your hands dirty... er, dirtier... Soil Appreciation IV is now yours for the taking.";
var last_published	= 1345146291;
var is_shareworthy	= 0;
var url		= "spent-first-emblem-of-mab";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/emblem_skill_unlock_mab_1_1336503045.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/emblem_skill_unlock_mab_1_1336503045_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/emblem_skill_unlock_mab_1_1336503045_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/emblem_skill_unlock_mab_1_1336503045_40.png";
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

//log.info("emblem_skill_unlock_mab_1.js LOADED");

// generated ok (NO DATE)
