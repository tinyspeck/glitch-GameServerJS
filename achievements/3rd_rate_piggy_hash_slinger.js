var name		= "3rd Rate Piggy Hash Slinger";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Fed 3 little Piglets until they grew up into Piggies";
var status_text		= "Congratulations on feeding three Piglets until they grew up into Piggies. You are now a 3rd Rate Piggy Hash Slinger. There's a badge and everything.";
var last_published	= 1316304311;
var is_shareworthy	= 0;
var url		= "3rd-rate-piggy-hash-slinger";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/3rd_rate_piggy_hash_slinger_1304984240.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/3rd_rate_piggy_hash_slinger_1304984240_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/3rd_rate_piggy_hash_slinger_1304984240_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/3rd_rate_piggy_hash_slinger_1304984240_40.png";
function on_apply(pc){
	
}
var conditions = {
	256 : {
		type	: "counter",
		group	: "animals_grown",
		label	: "piglet",
		value	: "3"
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
	pc.stats_add_xp(round_to_5(75 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 75,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 10
	}
};

//log.info("3rd_rate_piggy_hash_slinger.js LOADED");

// generated ok (NO DATE)
