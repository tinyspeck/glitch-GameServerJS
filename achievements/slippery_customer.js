var name		= "Slippery Customer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Skillfully eluded 29 pernicious Juju Bandits";
var status_text		= "Like a seasoned outlaw (or since you weren't the one breaking the law, a seasoned in-law) you've eluded 29 Juju Bandits. You're one Slippery Customer, and that's for sure.";
var last_published	= 1348802582;
var is_shareworthy	= 1;
var url		= "slippery-customer";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/slippery_customer_1315686134.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/slippery_customer_1315686134_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/slippery_customer_1315686134_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/slippery_customer_1315686134_40.png";
function on_apply(pc){
	
}
var conditions = {
	573 : {
		type	: "counter",
		group	: "juju_bandits",
		label	: "escaped",
		value	: "29"
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 60
	}
};

//log.info("slippery_customer.js LOADED");

// generated ok (NO DATE)
