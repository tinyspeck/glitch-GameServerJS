var name		= "First Eleven";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Learned your first eleven skills. Awww … so cute.";
var status_text		= "Some say the first eleven are the hardest. However, they are wrong: the last eleven are far, far harder. Still: good work!";
var last_published	= 1346089031;
var is_shareworthy	= 0;
var url		= "first-eleven-skills";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-26\/first_eleven_skills_1346014677.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-26\/first_eleven_skills_1346014677_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-26\/first_eleven_skills_1346014677_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-08-26\/first_eleven_skills_1346014677_40.png";
function on_apply(pc){
	
}
var conditions = {
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_currants(round_to_5(500 * multiplier));
	pc.metabolics_add_energy(round_to_5(200 * multiplier));
	pc.stats_add_favor_points("all", round_to_5(5 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 250,
	"currants"	: 500,
	"energy"	: 200,
	"favor"		: {
		"giant"		: "all",
		"points"	: 5
	}
};

//log.info("first_eleven_skills.js LOADED");

// generated ok (NO DATE)
