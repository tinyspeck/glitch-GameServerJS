var name		= "Common Snail Collector";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Coaxed 101 snails from a sloth";
var status_text		= "You persuaded a sloth to cough up 101 snails. Yippee, Common Snail Collector! You're on the ladder of ultimate snail collection now. Have a badge!";
var last_published	= 1340307760;
var is_shareworthy	= 0;
var url		= "common-snail-collector";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/common_snail_collector_1339702813.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/common_snail_collector_1339702813_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/common_snail_collector_1339702813_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/common_snail_collector_1339702813_40.png";
function on_apply(pc){
	
}
var conditions = {
	760 : {
		type	: "counter",
		group	: "sloth",
		label	: "snails_received",
		value	: "101"
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
	pc.stats_add_favor_points("humbaba", round_to_5(65 * multiplier));
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
		"giant"		: "humbaba",
		"points"	: 65
	}
};

//log.info("common_snail_collector.js LOADED");

// generated ok (NO DATE)
