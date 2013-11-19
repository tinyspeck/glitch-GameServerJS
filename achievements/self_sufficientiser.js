var name		= "Self-sufficientiser";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Had 7 cultivated resources on your home street";
var status_text		= "Proudly self sufficient (at least in the things you've planted), you created 7 marvellous resources on your home street. Come the revolution, you'll have a good stockpile. And here's the badge to prove it.";
var last_published	= 1340308195;
var is_shareworthy	= 0;
var url		= "self-sufficientiser";
var category		= "cultivation";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/self_sufficientiser_1339702867.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/self_sufficientiser_1339702867_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/self_sufficientiser_1339702867_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/self_sufficientiser_1339702867_40.png";
function on_apply(pc){
	
}
var conditions = {
	777 : {
		type	: "counter",
		group	: "cultivation_items",
		label	: "has",
		value	: "7"
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
	pc.stats_add_xp(round_to_5(350 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(55 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 350,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 55
	}
};

//log.info("self_sufficientiser.js LOADED");

// generated ok (NO DATE)
