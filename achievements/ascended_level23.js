var name		= "Beta Seraph";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "When the time of the Great Reset came, you had reached at least level 23. Then you ascended, and became part of the Glitchean firmament.";
var status_text		= "Beta Seraphim may sound like a particularly interesting classification of pharmaceuticals, it is actually the technical term for elite Glitches that, at the time of the Great Reset, had reached at least level 23. Glory be unto you.";
var last_published	= 1323923883;
var is_shareworthy	= 0;
var url		= "ascended-level23";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level23_1316136879.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level23_1316136879_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level23_1316136879_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level23_1316136879_40.png";
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

//log.info("ascended_level23.js LOADED");

// generated ok (NO DATE)
