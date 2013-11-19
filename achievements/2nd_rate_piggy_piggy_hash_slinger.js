var name		= "2nd Rate Piggy Hash Slinger";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Fed 23 little Piglets until they grew up into Piggies";
var status_text		= "Your diligence in feeding 23 Piglets until they grew into Piggies has earned you the distinction of being a 2nd Rate Piggy Hash Slinger.";
var last_published	= 1352092060;
var is_shareworthy	= 0;
var url		= "2nd-rate-piggy-piggy-hash-slinger";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/2nd_rate_piggy_piggy_hash_slinger_1304984245.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/2nd_rate_piggy_piggy_hash_slinger_1304984245_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/2nd_rate_piggy_piggy_hash_slinger_1304984245_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/2nd_rate_piggy_piggy_hash_slinger_1304984245_40.png";
function on_apply(pc){
	
}
var conditions = {
	257 : {
		type	: "counter",
		group	: "animals_grown",
		label	: "piglet",
		value	: "23"
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

//log.info("2nd_rate_piggy_piggy_hash_slinger.js LOADED");

// generated ok (NO DATE)
