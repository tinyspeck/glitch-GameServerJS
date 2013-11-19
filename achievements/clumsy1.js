var name		= "Clumsy";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Croaked 3 times. Oops.";
var status_text		= "You've croaked three times - oops! You've just earned a Clumsy badge. Maybe it will remind you to be more careful.";
var last_published	= 1348797090;
var is_shareworthy	= 1;
var url		= "clumsy";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/clumsy1_1304983932.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/clumsy1_1304983932_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/clumsy1_1304983932_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/clumsy1_1304983932_40.png";
function on_apply(pc){
	
}
var conditions = {
	203 : {
		type	: "counter",
		group	: "player",
		label	: "deaths",
		value	: "3"
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
	pc.stats_add_xp(round_to_5(75 * multiplier), true);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 75
};

//log.info("clumsy1.js LOADED");

// generated ok (NO DATE)
