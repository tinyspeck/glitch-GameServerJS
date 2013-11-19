var name		= "Shimla Mirch Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Shimla Mirch";
var status_text		= "You've peeked into every last dark mungy corner of Shimla Mirch, and that deserves some credit. And that credit takes the form of the title Shimla Mirch Completist.";
var last_published	= 1350066526;
var is_shareworthy	= 1;
var url		= "shimla-mirch-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/shimla_mirch_completist_1315685904.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/shimla_mirch_completist_1315685904_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/shimla_mirch_completist_1315685904_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/shimla_mirch_completist_1315685904_40.png";
function on_apply(pc){
	pc.quests_offer('where_the_blue_grew');
	
}
var conditions = {
	486 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_63",
		value	: "33"
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

//log.info("shimla_mirch_completist.js LOADED");

// generated ok (NO DATE)
