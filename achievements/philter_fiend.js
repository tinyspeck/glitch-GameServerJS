var name		= "Philter Fiend";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Quaffed or poured 151 Potions";
var status_text		= "Faster, brighter, stronger, better - Potions make the whole world zingier, right? And you should know, you've poured down 151 of them! POW!!!";
var last_published	= 1348802217;
var is_shareworthy	= 1;
var url		= "philter-fiend";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/philter_fiend_1322093725.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/philter_fiend_1322093725_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/philter_fiend_1322093725_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/philter_fiend_1322093725_40.png";
function on_apply(pc){
	
}
var conditions = {
	659 : {
		type	: "group_sum",
		group	: "potions_used",
		value	: "151"
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "ti",
		"points"	: 60
	}
};

//log.info("philter_fiend.js LOADED");

// generated ok (NO DATE)
