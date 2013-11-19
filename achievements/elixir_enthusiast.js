var name		= "Elixir Enthusiast";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Quaffed or poured 37 Potions";
var status_text		= "Faster than a speeding chicken! Higher than a Groddle pine! Potions get you there. Or, at least make you feel like you're there. SHAZAM!!!";
var last_published	= 1348797749;
var is_shareworthy	= 1;
var url		= "elixir-enthusiast";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-21\/elixir_enthusiast_1321896647.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-21\/elixir_enthusiast_1321896647_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-21\/elixir_enthusiast_1321896647_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-21\/elixir_enthusiast_1321896647_40.png";
function on_apply(pc){
	
}
var conditions = {
	658 : {
		type	: "group_sum",
		group	: "potions_used",
		value	: "37"
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(40 * multiplier));
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
		"giant"		: "ti",
		"points"	: 40
	}
};

//log.info("elixir_enthusiast.js LOADED");

// generated ok (NO DATE)
