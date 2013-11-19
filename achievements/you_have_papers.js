var name		= "You Have Papers!";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Having papers — in order, of course! — is required for various citizenshiply things, including for using public transportation.";
var status_text		= "You DO have papers! Well done. Now go ride a subway!";
var last_published	= 1348803112;
var is_shareworthy	= 1;
var url		= "you-have-papers";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/you_have_papers_1304985095.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/you_have_papers_1304985095_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/you_have_papers_1304985095_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/you_have_papers_1304985095_40.png";
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
	pc.stats_add_favor_points("lem", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"favor"	: {
		"giant"		: "lem",
		"points"	: 25
	}
};

//log.info("you_have_papers.js LOADED");

// generated ok (NO DATE)
