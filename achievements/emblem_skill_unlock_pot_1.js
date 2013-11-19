var name		= "Spent First Emblem of Pot";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gained the right to learn the savory secrets of Master Chef II";
var status_text		= "You've unharnessed the savory favor of Pot, who confers upon you the privilege of learning Master Chef II. Is this a nummier version of Master Chef I, you wonder? Dingdingding! You are correct.";
var last_published	= 1323915892;
var is_shareworthy	= 0;
var url		= "spent-first-emblem-of-pot";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/emblem_skill_unlock_pot_1_1304985037.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/emblem_skill_unlock_pot_1_1304985037_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/emblem_skill_unlock_pot_1_1304985037_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/emblem_skill_unlock_pot_1_1304985037_40.png";
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

//log.info("emblem_skill_unlock_pot_1.js LOADED");

// generated ok (NO DATE)
