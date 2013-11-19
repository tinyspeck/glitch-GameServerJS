var name		= "Candy Nommer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Nommed 79 Candy during Zilloween";
var status_text		= "There's something magical that happens to zilloween candy during the candy season that makes it taste extra special. What is it? No idea. But you've nommed 79 pieces.";
var last_published	= 1348797041;
var is_shareworthy	= 1;
var url		= "candy-nommer";
var category		= "seasonal";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_nommer_1319680228.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_nommer_1319680228_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_nommer_1319680228_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_nommer_1319680228_40.png";
function on_apply(pc){
	
}
var conditions = {
	614 : {
		type	: "counter",
		group	: "candy_eaten",
		label	: "zilloween",
		value	: "79"
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
	pc.stats_add_xp(round_to_5(550 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 550,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 100
	}
};

//log.info("candy_nommer.js LOADED");

// generated ok (NO DATE)
