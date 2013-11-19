var name		= "Spent First Emblem of Lem";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gained the ability to learn Teleportation III";
var status_text		= "This mighty unlocking opens the doors to Teleportation III. Should you choose to learn this skill, you will be able to teleport with less energy, save one more teleportation point, and be just one step away from Teleportation IV where things really get interesting.";
var last_published	= 1336499093;
var is_shareworthy	= 0;
var url		= "spent-first-emblem-of-lem";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/emblem_skill_unlock_lem_1_1336502853.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/emblem_skill_unlock_lem_1_1336502853_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/emblem_skill_unlock_lem_1_1336502853_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/emblem_skill_unlock_lem_1_1336502853_40.png";
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

//log.info("emblem_skill_unlock_lem_1.js LOADED");

// generated ok (NO DATE)
