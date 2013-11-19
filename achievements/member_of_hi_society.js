var name		= "Member of Hi Society";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Greeted players with all 11 Hi Sign variations";
var status_text		= "Hearts, flowers, butterflies and bats, you can't remember which was your favourite of the little Hi Signs, but, having seen them all, you're at least in a good position to think about it. AND to get a badge for it. Hurrah!";
var last_published	= 1351302629;
var is_shareworthy	= 1;
var url		= "member-of-hi-society";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/member_of_hi_society_1351296885.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/member_of_hi_society_1351296885_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/member_of_hi_society_1351296885_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/member_of_hi_society_1351296885_40.png";
function on_apply(pc){
	
}
var conditions = {
	842 : {
		type	: "group_count",
		group	: "hi_variants",
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 200
	}
};

//log.info("member_of_hi_society.js LOADED");

// generated ok (NO DATE)
