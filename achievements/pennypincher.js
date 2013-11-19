var name		= "Pennypincher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Socked away 2,022 currants";
var status_text		= "Oooh. Saved up 2,022 currants, have you? That's pretty nice … don't spend it all in one place";
var last_published	= 1323923328;
var is_shareworthy	= 0;
var url		= "pennypincher";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pennypincher_1304983962.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pennypincher_1304983962_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pennypincher_1304983962_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pennypincher_1304983962_40.png";
function on_apply(pc){
	
}
var conditions = {
	208 : {
		type	: "has_currants",
		value	: "2022"
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

//log.info("pennypincher.js LOADED");

// generated ok (NO DATE)
