var name		= "Candy Caner";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Caned 137 Candy during Zilloween";
var status_text		= "Why does Zilloween candy always taste so much better in the season of zilloween? I don't know, but it DOES. IT TASTES OF MAGIC AND JOYBALLS AND THUNDER AND YAY!";
var last_published	= 1348797037;
var is_shareworthy	= 1;
var url		= "candy-caner";
var category		= "seasonal";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_caner_1319680232.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_caner_1319680232_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_caner_1319680232_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_caner_1319680232_40.png";
function on_apply(pc){
	
}
var conditions = {
	615 : {
		type	: "counter",
		group	: "candy_eaten",
		label	: "zilloween",
		value	: "137"
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
	pc.stats_add_xp(round_to_5(750 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 750,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 150
	}
};

//log.info("candy_caner.js LOADED");

// generated ok (NO DATE)
