var name		= "Spent First Emblem of Tii";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Earned the right to learn Intermediate Admixing";
var status_text		= "Unlocking this Emblem of Tii gives you the power to become an intermediate admixer. If you so choose, the coveted skill of Intermediate Admixing can be yours.";
var last_published	= 1323915901;
var is_shareworthy	= 0;
var url		= "spent-first-emblem-of-tii";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-22\/emblem_skill_unlock_ti_1_1316736344.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-22\/emblem_skill_unlock_ti_1_1316736344_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-22\/emblem_skill_unlock_ti_1_1316736344_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-22\/emblem_skill_unlock_ti_1_1316736344_40.png";
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

//log.info("emblem_skill_unlock_ti_1.js LOADED");

// generated ok (NO DATE)
