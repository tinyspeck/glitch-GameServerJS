var name		= "Spent First Emblem of Alph";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gained the ability to scale the heights of tinkery with Tinkering IV";
var status_text		= "Whoa... do you feel it? Tingling fingers? Itchy palms? Greasy elbows? No, it's not a medical emergency. It's just the power of Alph conferring upon you the ability to learn Tinkering IV.";
var last_published	= 1323915859;
var is_shareworthy	= 0;
var url		= "spent-first-emblem-of-alph";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-22\/emblem_skill_unlock_alph_1_1316736340.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-22\/emblem_skill_unlock_alph_1_1316736340_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-22\/emblem_skill_unlock_alph_1_1316736340_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-22\/emblem_skill_unlock_alph_1_1316736340_40.png";
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

//log.info("emblem_skill_unlock_alph_1.js LOADED");

// generated ok (NO DATE)
