var name		= "Alakol Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Alakol";
var status_text		= "You've walked every misty cliff-top in Alakol, and gazed out to sea over the rocky mounds that line its glorious shores. You may not be master of all you survey, but you ARE master of the title Alakol Completist. Mazeltov.";
var last_published	= 1350065411;
var is_shareworthy	= 1;
var url		= "alakol-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/alakol_completist_1315685915.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/alakol_completist_1315685915_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/alakol_completist_1315685915_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/alakol_completist_1315685915_40.png";
function on_apply(pc){
	
}
var conditions = {
	489 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_76",
		value	: "37"
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

//log.info("alakol_completist.js LOADED");

// generated ok (NO DATE)
