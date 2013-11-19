var name		= "Candy Muncher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Munched 17 Candy during Zilloween";
var status_text		= "You know that heart-thumping brain-fizzling illicit sugar rush you get from eating holiday candy at holiday time? Well, you do, because you've had that a whole 17 times. WHEEEEE!!!!";
var last_published	= 1323924113;
var is_shareworthy	= 0;
var url		= "candy-muncher";
var category		= "seasonal";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_muncher_1319680221.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_muncher_1319680221_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_muncher_1319680221_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-26\/candy_muncher_1319680221_40.png";
function on_apply(pc){
	
}
var conditions = {
	612 : {
		type	: "counter",
		group	: "candy_eaten",
		label	: "zilloween",
		value	: "17"
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 20
	}
};

//log.info("candy_muncher.js LOADED");

// generated ok (NO DATE)
