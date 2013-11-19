var name		= "Trader Carl";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Traded with other players 41 times";
var status_text		= "You've traded your way to the status of Trader Carl. Named for a guy named Carl who traded a fair bit back in the day, this badge is much coveted amongst those who trade. May Carl bless your every transaction.";
var last_published	= 1348803064;
var is_shareworthy	= 1;
var url		= "trader-carl";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/trader_carl_1304984984.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/trader_carl_1304984984_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/trader_carl_1304984984_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/trader_carl_1304984984_40.png";
function on_apply(pc){
	
}
var conditions = {
	386 : {
		type	: "group_sum",
		group	: "players_traded",
		value	: "41"
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
	pc.stats_add_favor_points("friendly", round_to_5(50 * multiplier));
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
		"points"	: 50
	}
};

//log.info("trader_carl.js LOADED");

// generated ok (NO DATE)
