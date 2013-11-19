var name		= "Zombie";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Croaked 251 times.";
var status_text		= "Well, for whatever it's worth, you've just won a Zombie badge. Would a warning to be more careful even help at this point?";
var last_published	= 1348803115;
var is_shareworthy	= 1;
var url		= "zombie";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/zombie_1304983950.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/zombie_1304983950_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/zombie_1304983950_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/zombie_1304983950_40.png";
function on_apply(pc){
	
}
var conditions = {
	206 : {
		type	: "counter",
		group	: "player",
		label	: "deaths",
		value	: "251"
	},
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500
};

//log.info("zombie.js LOADED");

// generated ok (NO DATE)
