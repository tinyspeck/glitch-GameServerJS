var name		= "High-Ranking Supplicant";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Donated to Shrines 251 times";
var status_text		= "You have officially donated to a plopload of Shrines. Sure, being a supplicant is kind of subservient, but you! You are tops among the subservient. That's got to count for something, right? Contemplate this as you enjoy your new High-Ranking Supplicant badge.";
var last_published	= 1348799139;
var is_shareworthy	= 1;
var url		= "highranking-supplicant";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/highranking_supplicant_1316456544.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/highranking_supplicant_1316456544_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/highranking_supplicant_1316456544_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/highranking_supplicant_1316456544_40.png";
function on_apply(pc){
	
}
var conditions = {
	355 : {
		type	: "group_sum",
		group	: "shrines_donated",
		value	: "251"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600
};

//log.info("highranking_supplicant.js LOADED");

// generated ok (NO DATE)
