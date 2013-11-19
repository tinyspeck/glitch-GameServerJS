var name		= "Beta Ophan";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "When the time of the Great Reset came, you had reached at least level 31. Then you ascended, and became part of The Great Gitchurian Canon.";
var status_text		= "When Glitchurian Scholars talk of the Beta Ophans, they do not mean the children of early Glitchers, neglected while their parents were busy filing bug reports. They mean the Ophanim, the esteemed few who made it to a level greater than 31 before ascending. Glory be to you, Beta Ophan!";
var last_published	= 1323923887;
var is_shareworthy	= 0;
var url		= "ascended-level31";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_level31_1315970787.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_level31_1315970787_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_level31_1315970787_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/ascended_level31_1315970787_40.png";
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

//log.info("ascended_level31.js LOADED");

// generated ok (NO DATE)
