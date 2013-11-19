var name		= "Choru Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Choru";
var status_text		= "They laughed when you said you'd have the staying power to make it down every dusty street in Choru. But then you did. Who's laughing now? You are. You and your beautiful Choru Completist Badge. Laugh on, little explorer.";
var last_published	= 1350065897;
var is_shareworthy	= 1;
var url		= "choru-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/choru_completist_1315685941.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/choru_completist_1315685941_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/choru_completist_1315685941_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/choru_completist_1315685941_40.png";
function on_apply(pc){
	
}
var conditions = {
	499 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_90",
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 50
	}
};

//log.info("choru_completist.js LOADED");

// generated ok (NO DATE)
