var name		= "Jethimadh Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Jethimadh";
var status_text		= "You've circled the great tower of Jethimadh on foot, and gazed upon its dizzying heights from every conceivable angle, and you're still not sure how high it goes. But one thing is sure: You're now a Jethimadh Completist.";
var last_published	= 1350066282;
var is_shareworthy	= 1;
var url		= "jethimadh-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/jethimadh_completist_1315685912.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/jethimadh_completist_1315685912_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/jethimadh_completist_1315685912_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/jethimadh_completist_1315685912_40.png";
function on_apply(pc){
	pc.quests_offer('where_the_blue_grew');
	
}
var conditions = {
	488 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_71",
		value	: "32"
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

//log.info("jethimadh_completist.js LOADED");

// generated ok (NO DATE)
