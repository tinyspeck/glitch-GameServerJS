var name		= "The Impossible Achievement";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "This one ... well, you really can't get it.";
var status_text		= "";
var last_published	= 1306874869;
var is_shareworthy	= 0;
var url		= "no-achievement-for-you";
var category		= "";
var url_swf		= null;
var url_img_180		= null;
var url_img_60		= null;
var url_img_40		= null;
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

//log.info("impossible_achievement.js LOADED");

// generated ok (NO DATE)
