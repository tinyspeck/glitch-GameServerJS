var name		= "Bacon Biter";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Nibbled on 41 enthusiastically acquiescent Piggies";
var status_text		= "No doubt about it: you like a little Piggy now and again. And clearly they like it when you bite their bacon, hence this here Bacon Biter badge.";
var last_published	= 1348796741;
var is_shareworthy	= 1;
var url		= "bacon-biter";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bacon_biter_1304984218.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bacon_biter_1304984218_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bacon_biter_1304984218_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bacon_biter_1304984218_40.png";
function on_apply(pc){
	
}
var conditions = {
	252 : {
		type	: "counter",
		group	: "npc_piggy",
		label	: "nibble",
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 25
	}
};

//log.info("bacon_biter.js LOADED");

// generated ok (NO DATE)
