var name		= "Spent First Emblem of Humbaba";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Earned the right to learn the slightly whiffy secrets of Animal Kinship VI";
var status_text		= "Click! And behold! The slightly whiffy secrets of Animal Kinship VI are yours for the taking. If you dare. (You should probably dare.)";
var last_published	= 1323915880;
var is_shareworthy	= 0;
var url		= "spent-first-emblem-of-humbaba";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-13\/emblem_skill_unlock_humbaba_1_1352832980.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-13\/emblem_skill_unlock_humbaba_1_1352832980_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-13\/emblem_skill_unlock_humbaba_1_1352832980_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-13\/emblem_skill_unlock_humbaba_1_1352832980_40.png";
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

//log.info("emblem_skill_unlock_humbaba_1.js LOADED");

// generated ok (NO DATE)
