var name		= "Chicken Tender";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Raised 3 Chicks to the full bloom of adult chickenhood";
var status_text		= "You've lovingly raised 3 Chicks to the full bloom of adult chickenhood. They grow up so quickly, don't they? Never mind, you. Here's a Chicken Tender badge to reward your poultering efforts.";
var last_published	= 1344289526;
var is_shareworthy	= 0;
var url		= "chicken-tender";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/chicken_tender_1304983754.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/chicken_tender_1304983754_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/chicken_tender_1304983754_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/chicken_tender_1304983754_40.png";
function on_apply(pc){
	
}
var conditions = {
	171 : {
		type	: "counter",
		group	: "animals_grown",
		label	: "chick",
		value	: "3"
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
	pc.stats_add_xp(round_to_5(75 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 75,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 10
	}
};

//log.info("chicken_tender.js LOADED");

// generated ok (NO DATE)
