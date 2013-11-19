var name		= "5-Star Cuisinartist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Whipped up 101 meals with an Awesome Pot";
var status_text		= "It's alimentary! You've earned the title 5-star Cuisinartist.";
var last_published	= 1348796018;
var is_shareworthy	= 1;
var url		= "5star-cuisinartist";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/5star_cuisinartist_1315979183.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/5star_cuisinartist_1315979183_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/5star_cuisinartist_1315979183_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-13\/5star_cuisinartist_1315979183_40.png";
function on_apply(pc){
	
}
var conditions = {
	46 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "awesome_pot",
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 60
	}
};

//log.info("5star_cuisinartist.js LOADED");

// generated ok (NO DATE)
