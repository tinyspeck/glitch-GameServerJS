var name		= "The Imp";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Had the Crown for 101 seconds";
var status_text		= "Others may not have realised your cheeky rise to power, but slowly, surely, you've learnt to keep your little mitts on the crown to the point you've reached the first level of clammy-handed crown-clutching. 101 seconds?! You little Imp, you!";
var last_published	= 1348802920;
var is_shareworthy	= 1;
var url		= "the-imp";
var category		= "games";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/the_imp_1315518628.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/the_imp_1315518628_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/the_imp_1315518628_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/the_imp_1315518628_40.png";
function on_apply(pc){
	
}
var conditions = {
	594 : {
		type	: "counter",
		group	: "it_game",
		label	: "seconds_with_crown",
		value	: "101"
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
	pc.stats_add_favor_points("friendly", round_to_5(20 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 20
	}
};

//log.info("the_imp.js LOADED");

// generated ok (NO DATE)
