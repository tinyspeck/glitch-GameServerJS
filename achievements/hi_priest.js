var name		= "Hi Priest";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Achieved a Mega-Hi 79 times";
var status_text		= "So many like-minded Glitches roaming streets of Ur. And through serendipity or sheer hard graft, you found 79 of them. You're like the Hi Priest of the Mega-Hi. Mega high five!";
var last_published	= 1351302645;
var is_shareworthy	= 1;
var url		= "hi-priest";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/hi_priest_1351296894.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/hi_priest_1351296894_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/hi_priest_1351296894_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/hi_priest_1351296894_40.png";
function on_apply(pc){
	
}
var conditions = {
	844 : {
		type	: "group_sum",
		group	: "hi_jackpot",
		value	: "79"
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
	pc.stats_add_xp(round_to_5(750 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 750,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 150
	}
};

//log.info("hi_priest.js LOADED");

// generated ok (NO DATE)
