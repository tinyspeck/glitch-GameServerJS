var name		= "Homesteader";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Took the big plunge and purchased first home";
var status_text		= "You've purchased your first home! Your new Homesteader badge comes with a warning: Beware the couch surfer. Also: roof rot.";
var last_published	= 1323923751;
var is_shareworthy	= 0;
var url		= "homesteader";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/homesteader_1304984945.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/homesteader_1304984945_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/homesteader_1304984945_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/homesteader_1304984945_40.png";
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400
};

//log.info("homesteader.js LOADED");

// generated ok (NO DATE)
