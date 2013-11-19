var name		= "Humble Bragger";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Displayed 11 trophies in your home";
var status_text		= "Big, shiny and representing the heights of your awesomeness, you've put those 11 trophies on display. Why not? You earned them, why not show them off? Hey: AND this badge! Bonus!";
var last_published	= 1348799176;
var is_shareworthy	= 1;
var url		= "humble-bragger";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/humble_bragger_1352232454.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/humble_bragger_1352232454_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/humble_bragger_1352232454_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/humble_bragger_1352232454_40.png";
function on_apply(pc){
	
}
var conditions = {
	776 : {
		type	: "counter",
		group	: "trophy",
		label	: "placed_eleven",
		value	: "1"
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(80 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 80
	}
};

//log.info("humble_bragger.js LOADED");

// generated ok (NO DATE)
