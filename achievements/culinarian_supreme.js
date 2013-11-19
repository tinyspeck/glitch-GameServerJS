var name		= "Culinarian Supreme";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Prepared 137 unique food and drink recipes";
var status_text		= "You've really got your mise en place in place. Having made almost every food and drink item under the sun, you've earned the title Culinarian Supreme!";
var last_published	= 1354652857;
var is_shareworthy	= 1;
var url		= "culinarian-supreme";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-12-03\/culinarian_supreme_1354603906.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-12-03\/culinarian_supreme_1354603906_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-12-03\/culinarian_supreme_1354603906_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-12-03\/culinarian_supreme_1354603906_40.png";
function on_apply(pc){
	
}
var conditions = {
	17 : {
		type	: "group_count",
		group	: "making_food",
		value	: "137"
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
	pc.stats_add_xp(round_to_5(10000 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(1000 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 10000,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 1000
	}
};

//log.info("culinarian_supreme.js LOADED");

// generated ok (NO DATE)
