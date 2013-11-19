var name		= "Zhambu Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Zhambu";
var status_text		= "You've delicately picked your way through every road on the hazardous Ju-Ju-filled plains of Zhambu. They may have taken many things from you, but they couldn't take this: your Zhambu Completist badge. Because you didn't have it yet. (They still can't take it, don't worry).";
var last_published	= 1350066603;
var is_shareworthy	= 1;
var url		= "zhambu-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/zhambu_completist_1315685938.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/zhambu_completist_1315685938_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/zhambu_completist_1315685938_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/zhambu_completist_1315685938_40.png";
function on_apply(pc){
	
}
var conditions = {
	498 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_91",
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

//log.info("zhambu_completist.js LOADED");

// generated ok (NO DATE)
