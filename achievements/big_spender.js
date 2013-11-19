var name		= "Big Spender";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Made a purchase worth 1009 or more currants";
var status_text		= "Celebrating this biggish purchase with a Big Spender badge could lead to big things for you. Such as a big case of buyer's remorse.";
var last_published	= 1343958644;
var is_shareworthy	= 0;
var url		= "big-spender";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-03\/big_spender_1344032038.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-03\/big_spender_1344032038_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-03\/big_spender_1344032038_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-03\/big_spender_1344032038_40.png";
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100
};

//log.info("big_spender.js LOADED");

// generated ok (NO DATE)
