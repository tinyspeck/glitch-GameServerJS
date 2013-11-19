var name		= "Gas Guzzler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Refueled 23 machines";
var status_text		= "You're so in tune with machines, you're ready to refuel before they even splutter to a stop. 23 machines owe you their life. Hats off to you, Gas Guzzler.";
var last_published	= 1340307752;
var is_shareworthy	= 0;
var url		= "gas-guzzler";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/gas_guzzler_1339698250.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/gas_guzzler_1339698250_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/gas_guzzler_1339698250_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/gas_guzzler_1339698250_40.png";
function on_apply(pc){
	
}
var conditions = {
	699 : {
		type	: "counter",
		group	: "machines",
		label	: "refueled",
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(75 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 75
	}
};

//log.info("gas_guzzler.js LOADED");

// generated ok (NO DATE)
