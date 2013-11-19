var name		= "Bootleg Facilitator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Diligently distilled 913 Hooches in your back yard";
var status_text		= "You let nothing stand in your way in your bid to become one of Ur's no.1 booze-fountains. 913 Hooches later, here you are. Sláinte!";
var last_published	= 1348796811;
var is_shareworthy	= 1;
var url		= "bootleg-facilitator";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/bootleg_facilitator_1321576680.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/bootleg_facilitator_1321576680_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/bootleg_facilitator_1321576680_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/bootleg_facilitator_1321576680_40.png";
function on_apply(pc){
	
}
var conditions = {
	637 : {
		type	: "counter",
		group	: "still",
		label	: "collected_in_pol",
		value	: "913"
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
	pc.stats_add_favor_points("friendly", round_to_5(150 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 150
	}
};

//log.info("bootleg_facilitator.js LOADED");

// generated ok (NO DATE)
