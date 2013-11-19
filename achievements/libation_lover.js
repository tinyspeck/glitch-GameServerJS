var name		= "Libation Lover";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Quaffed or poured 353 Potions";
var status_text		= "Sorcerers whisper your name in awe. Wizards have pictures of you in their lockers. You've poured down 353 Potions, and lived to tell the tale. Which tale? The tale of how amazing you are, of course. BAM!";
var last_published	= 1348801486;
var is_shareworthy	= 1;
var url		= "libation-lover";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/libation_lover_1322093728.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/libation_lover_1322093728_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/libation_lover_1322093728_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/libation_lover_1322093728_40.png";
function on_apply(pc){
	
}
var conditions = {
	660 : {
		type	: "group_sum",
		group	: "potions_used",
		value	: "353"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "ti",
		"points"	: 150
	}
};

//log.info("libation_lover.js LOADED");

// generated ok (NO DATE)
