var name		= "Groddle Meadow Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Groddle Meadow";
var status_text		= "Oh sure, Groddle Meadow may not have the show-offy drama of Groddle Heights or the dramatic views of Alakol. But this green and pleasant land certainly contains a lot of roads, and you've travelled them all. For that you've earned the title Groddle Meadow Completist.";
var last_published	= 1350066033;
var is_shareworthy	= 1;
var url		= "groddle-meadows-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/groddle_meadows_completist_1315685901.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/groddle_meadows_completist_1315685901_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/groddle_meadows_completist_1315685901_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/groddle_meadows_completist_1315685901_40.png";
function on_apply(pc){
	
}
var conditions = {
	485 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_58",
		value	: "40"
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 40
	}
};

//log.info("groddle_meadows_completist.js LOADED");

// generated ok (NO DATE)
