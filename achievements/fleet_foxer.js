var name		= "Fleet Foxer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Brushed the same fox 3 times in 10 seconds";
var status_text		= "What's quick like a fox? Well, a fox is. But what else is? You, Fleet Foxer, and your ability to brush the same fox three times in less than ten seconds. A triple-brush!";
var last_published	= 1348798470;
var is_shareworthy	= 1;
var url		= "fleet-foxer";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/fleet_foxer_1339701256.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/fleet_foxer_1339701256_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/fleet_foxer_1339701256_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/fleet_foxer_1339701256_40.png";
function on_apply(pc){
	
}
var conditions = {
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 40
	}
};

//log.info("fleet_foxer.js LOADED");

// generated ok (NO DATE)
