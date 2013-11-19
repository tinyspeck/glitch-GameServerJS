var name		= "Trader Vic";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Traded with other players 17 times";
var status_text		= "To have traded as much as you indicates high levels of interpersonal synergizing. In recognition of your delightfully traderous heart, you are now a Trader Vic.";
var last_published	= 1338927279;
var is_shareworthy	= 0;
var url		= "trader-vic";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/trader_vic_1304984978.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/trader_vic_1304984978_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/trader_vic_1304984978_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/trader_vic_1304984978_40.png";
function on_apply(pc){
	
}
var conditions = {
	385 : {
		type	: "group_sum",
		group	: "players_traded",
		value	: "17"
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 25
	}
};

//log.info("trader_vic.js LOADED");

// generated ok (NO DATE)
