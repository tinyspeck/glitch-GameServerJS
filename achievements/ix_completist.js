var name		= "Ix Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Ix";
var status_text		= "You've tumbled down the great hole and adventured in every corner of the ancient wonderland of Ix, traversing every Spice, from West to East (or East to West, if you are that way inclined) until you earned the title Ix Completist. Which you did. Go you!";
var last_published	= 1350066263;
var is_shareworthy	= 1;
var url		= "ix-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/ix_completist_1315686153.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/ix_completist_1315686153_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/ix_completist_1315686153_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/ix_completist_1315686153_40.png";
function on_apply(pc){
	
}
var conditions = {
	592 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_27",
		value	: "7"
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
	pc.stats_add_favor_points("lem", round_to_5(15 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 15
	}
};

//log.info("ix_completist.js LOADED");

// generated ok (NO DATE)
