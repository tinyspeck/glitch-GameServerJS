var name		= "Aspirational Home Improver";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Chose 11 unique furniture upgrades";
var status_text		= "Plain and simple were not enough for you, and who can blame you. 11 exciting furniture upgrades later, you have 11 beautiful pieces of upgraded furniture, AND this badge. Aspirational!";
var last_published	= 1341425714;
var is_shareworthy	= 0;
var url		= "aspirational-home-improver";
var category		= "furniture";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/aspirational_home_improver_1339701324.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/aspirational_home_improver_1339701324_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/aspirational_home_improver_1339701324_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/aspirational_home_improver_1339701324_40.png";
function on_apply(pc){
	
}
var conditions = {
	758 : {
		type	: "group_sum",
		group	: "upgraded",
		value	: "11"
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
	pc.stats_add_favor_points("alph", round_to_5(50 * multiplier));
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
		"giant"		: "alph",
		"points"	: 50
	}
};

//log.info("aspirational_home_improver.js LOADED");

// generated ok (NO DATE)
