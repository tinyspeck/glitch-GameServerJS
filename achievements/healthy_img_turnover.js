var name		= "Healthy iMG turnover";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Got more than 503 iMG per day as a Stipend";
var status_text		= "People came to your homestreet, and while they were there, they used your stuff enough to ensure a Healthy 503 iMG Daily Stipend. And THAT's when good neighbours become good friends.";
var last_published	= 1348799103;
var is_shareworthy	= 1;
var url		= "healthy-img-turnover";
var category		= "cultivation";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/healthy_img_turnover_1339702869.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/healthy_img_turnover_1339702869_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/healthy_img_turnover_1339702869_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/healthy_img_turnover_1339702869_40.png";
function on_apply(pc){
	
}
var conditions = {
	774 : {
		type	: "counter",
		group	: "daily_img",
		label	: "five_hundred_three",
		value	: "1"
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
	pc.stats_add_favor_points("friendly", round_to_5(60 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 60
	}
};

//log.info("healthy_img_turnover.js LOADED");

// generated ok (NO DATE)
