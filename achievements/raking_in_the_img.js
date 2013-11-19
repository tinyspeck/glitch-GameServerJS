var name		= "Raking in the iMG";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Drew more than 1009 iMG per day in Stipend";
var status_text		= "You built it. They came. And while you were sleeping, enough petting, harvesting, tending and whatever else was done in your home street to raise 1009 iMG and a shiny new badge. YAY!";
var last_published	= 1348802462;
var is_shareworthy	= 1;
var url		= "raking-in-the-img";
var category		= "cultivation";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/raking_in_the_img_1339702872.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/raking_in_the_img_1339702872_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/raking_in_the_img_1339702872_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/raking_in_the_img_1339702872_40.png";
function on_apply(pc){
	
}
var conditions = {
	773 : {
		type	: "counter",
		group	: "daily_img",
		label	: "one_thousand_nine",
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(175 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 175
	}
};

//log.info("raking_in_the_img.js LOADED");

// generated ok (NO DATE)
