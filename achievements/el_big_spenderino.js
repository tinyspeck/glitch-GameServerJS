var name		= "El Big Spenderino";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Made a purchase worth 2003 or more currants";
var status_text		= "You've just blown 2003 or more currants. Hope it was worth it. In case it wasn't, at least you can show this badge and tell people that once upon a time, you were an El Big Spenderino.";
var last_published	= 1349313869;
var is_shareworthy	= 1;
var url		= "el-big-spenderino";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-03\/el_big_spenderino_1344032042.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-03\/el_big_spenderino_1344032042_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-03\/el_big_spenderino_1344032042_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-03\/el_big_spenderino_1344032042_40.png";
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200
};

//log.info("el_big_spenderino.js LOADED");

// generated ok (NO DATE)
