var name		= "Moonshiner";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Delightedly distilled 11 Hooches in your back yard";
var status_text		= "Once, alcohol creation was beyond you, now, you are a bubbling wellspring of booziness. You've now made 11 handcrafted Hooches, to sell, give away or, well, drink… Salud!";
var last_published	= 1348801902;
var is_shareworthy	= 1;
var url		= "moonshiner";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/moonshiner_1321576667.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/moonshiner_1321576667_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/moonshiner_1321576667_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/moonshiner_1321576667_40.png";
function on_apply(pc){
	
}
var conditions = {
	634 : {
		type	: "counter",
		group	: "still",
		label	: "collected_in_pol",
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(20 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 20
	}
};

//log.info("moonshiner.js LOADED");

// generated ok (NO DATE)
