var name		= "Nervous Belch Award";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Stoically slurped 11 Savory Smoothies";
var status_text		= "Smoothie? That was more like a bumpy! Distract yourself from the meaty aftertaste with a Nervous Belch Award.";
var last_published	= 1348801918;
var is_shareworthy	= 1;
var url		= "nervous-belch-award";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/nervous_belch_award_1304983788.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/nervous_belch_award_1304983788_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/nervous_belch_award_1304983788_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/nervous_belch_award_1304983788_40.png";
function on_apply(pc){
	
}
var conditions = {
	178 : {
		type	: "counter",
		group	: "items_drank",
		label	: "savory_smoothie",
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(15 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 15
	}
};

//log.info("nervous_belch_award.js LOADED");

// generated ok (NO DATE)
