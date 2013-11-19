var name		= "Andra Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Andra";
var status_text		= "You've ranged across the great serengetiesque plains of Andra, and admired every small rocky lump, every scrubby hillock, and every dry grassy knoll as far as the eye can see. Which - as any Andra Completist (that's you!) will tell you - is a very, very long way.";
var last_published	= 1350065420;
var is_shareworthy	= 1;
var url		= "andra-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/andra_completist_1315685933.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/andra_completist_1315685933_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/andra_completist_1315685933_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/andra_completist_1315685933_40.png";
function on_apply(pc){
	
}
var conditions = {
	496 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_89",
		value	: "27"
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

//log.info("andra_completist.js LOADED");

// generated ok (NO DATE)
