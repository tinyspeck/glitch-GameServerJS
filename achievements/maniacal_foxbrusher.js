var name		= "Maniacal Foxbrusher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Brushed 50,003 fibers from the tails of foxes";
var status_text		= "It is a wonder that the foxes of Ur aren't wandering the preserves with thrashing bald whips for tails, so many fibers have you brushed. 50,003!?! You deserve this badge, Maniacal Foxbrusher!";
var last_published	= 1348801549;
var is_shareworthy	= 1;
var url		= "maniacal-foxbrusher";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/maniacal_foxbrusher_1339701248.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/maniacal_foxbrusher_1339701248_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/maniacal_foxbrusher_1339701248_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/maniacal_foxbrusher_1339701248_40.png";
function on_apply(pc){
	
}
var conditions = {
	736 : {
		type	: "counter",
		group	: "fox",
		label	: "fibers_brushed",
		value	: "50003"
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
	pc.stats_add_xp(round_to_5(1200 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1200,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 200
	}
};

//log.info("maniacal_foxbrusher.js LOADED");

// generated ok (NO DATE)
