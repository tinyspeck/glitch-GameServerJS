var name		= "Shiny Happy Beta Angel";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "When the time of the Great Reset came, you had reached at least level 41. Then you ascended, and entered the annals of Glitchean history.";
var status_text		= "Glitchorian lore will forever record that in The Great Before, some Glitches stretched their wings and levelled up like there was no tomorrow. As it turned out, there wasn't. But they still ascended above level 41, and were thus crowned Shiny Happy Beta Angels. Glory be!";
var last_published	= 1323923890;
var is_shareworthy	= 0;
var url		= "ascended-level41";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level41_1316136883.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level41_1316136883_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level41_1316136883_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-15\/ascended_level41_1316136883_40.png";
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

//log.info("ascended_level41.js LOADED");

// generated ok (NO DATE)
