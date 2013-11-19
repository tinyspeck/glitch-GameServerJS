var name		= "Philanthropic Member of the Social Construct";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Contributed more than 50% to the completion of another player's restoration project";
var status_text		= "It's good to give. In this case, it's doubly good to give, as not only do you earn respect and love of a fellow glitch: you earned a badge. KABOOM!";
var last_published	= 1348802214;
var is_shareworthy	= 1;
var url		= "philanthropic-member-of-the-social-construct";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/philanthropic_member_of_the_social_construct_1339707333.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/philanthropic_member_of_the_social_construct_1339707333_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/philanthropic_member_of_the_social_construct_1339707333_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/philanthropic_member_of_the_social_construct_1339707333_40.png";
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(50 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 50
	}
};

//log.info("philanthropic_member_of_the_social_construct.js LOADED");

// generated ok (NO DATE)
