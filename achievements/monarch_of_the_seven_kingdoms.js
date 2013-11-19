var name		= "Monarch of the Seven Kingdoms";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Had the Crown for 100003 seconds";
var status_text		= "It's unclear which seven kingdoms are being referred to here, unless they include Jumpiland and Platformia. But whatever: against all odds, you've hung on to the crown for 100003 seconds - just crown yourself monarch and have done with it. Huzzah!";
var last_published	= 1348801894;
var is_shareworthy	= 1;
var url		= "monarch-of-the-seven-kingdoms";
var category		= "games";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/monarch_of_the_seven_kingdoms_1315512121.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/monarch_of_the_seven_kingdoms_1315512121_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/monarch_of_the_seven_kingdoms_1315512121_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/monarch_of_the_seven_kingdoms_1315512121_40.png";
function on_apply(pc){
	
}
var conditions = {
	586 : {
		type	: "counter",
		group	: "it_game",
		label	: "seconds_with_crown",
		value	: "100003"
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
	pc.stats_add_xp(round_to_5(1500 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(250 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1500,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 250
	}
};

//log.info("monarch_of_the_seven_kingdoms.js LOADED");

// generated ok (NO DATE)
