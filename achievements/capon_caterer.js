var name		= "Capon Caterer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Nourished 103 Chicks to squawky adulthood";
var status_text		= "Without you, there would be 103 fewer Chickens in the world. Would this be a great loss? Who can say. Regardless, enjoy your newfound title, Capon Caterer.";
var last_published	= 1348797053;
var is_shareworthy	= 1;
var url		= "capon-caterer";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/capon_caterer_1304984193.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/capon_caterer_1304984193_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/capon_caterer_1304984193_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/capon_caterer_1304984193_40.png";
function on_apply(pc){
	
}
var conditions = {
	251 : {
		type	: "counter",
		group	: "animals_grown",
		label	: "chick",
		value	: "103"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(125 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 125
	}
};

//log.info("capon_caterer.js LOADED");

// generated ok (NO DATE)
