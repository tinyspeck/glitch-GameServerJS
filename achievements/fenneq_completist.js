var name		= "Fenneq Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Fenneq";
var status_text		= "You traversed over all the rocks, and got back up after you tripped on a few. You chased all the foxes, even when you realized you're not a very fast runner. You are a true Fenneq champion and rightfully deserve one of these ultra-special-badge-y-thingies.";
var last_published	= 1350065954;
var is_shareworthy	= 1;
var url		= "fenneq-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-24\/fenneq_completist_1335307201.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-24\/fenneq_completist_1335307201_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-24\/fenneq_completist_1335307201_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-24\/fenneq_completist_1335307201_40.png";
function on_apply(pc){
	
}
var conditions = {
	669 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_123",
		value	: "19"
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
	pc.stats_add_favor_points("lem", round_to_5(20 * multiplier));
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
		"giant"		: "lem",
		"points"	: 20
	}
};

//log.info("fenneq_completist.js LOADED");

// generated ok (NO DATE)
