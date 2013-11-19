var name		= "Hi Baller";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Made friends with a Mega-Hi 13 times over";
var status_text		= "When a Glitch meets a Glitch and they have matching Hi Signs, something magical happens. And when that happens 13 times, something else happens. And THAT thing (the second thing) is this thing. It's a badge, Hi Baller! A badge!";
var last_published	= 1351302640;
var is_shareworthy	= 1;
var url		= "hi-baller";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/hi_baller_1351296891.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/hi_baller_1351296891_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/hi_baller_1351296891_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/hi_baller_1351296891_40.png";
function on_apply(pc){
	
}
var conditions = {
	843 : {
		type	: "group_sum",
		group	: "hi_jackpot",
		value	: "13"
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
	pc.stats_add_favor_points("friendly", round_to_5(65 * multiplier));
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
		"points"	: 65
	}
};

//log.info("hi_baller.js LOADED");

// generated ok (NO DATE)
