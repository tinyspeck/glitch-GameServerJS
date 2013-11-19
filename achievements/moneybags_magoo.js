var name		= "Moneybags Magoo";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Made a purchase worth 5003 or more currants";
var status_text		= "When you spend as many currants as you just did, they call you Moneybags Magoo. And just so you don't forget it, here's a badge.";
var last_published	= 1348801898;
var is_shareworthy	= 1;
var url		= "moneybags-magoo";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-03\/moneybags_magoo_1344032047.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-03\/moneybags_magoo_1344032047_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-03\/moneybags_magoo_1344032047_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-03\/moneybags_magoo_1344032047_40.png";
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

//log.info("moneybags_magoo.js LOADED");

// generated ok (NO DATE)
