var name		= "Master Overlord of the Spice Dominion";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 5003 olfactorily satisfying Spices";
var status_text		= "For harvesting 5003 olfactorily satisfying Spices, you've earned the title Master Overlord of the Spice Dominion, which is all kinds of awesome. Say it out loud. See?";
var last_published	= 1348801857;
var is_shareworthy	= 1;
var url		= "master-overlord-of-the-spice-dominion";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_overlord_of_the_spice_dominion_1304984507.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_overlord_of_the_spice_dominion_1304984507_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_overlord_of_the_spice_dominion_1304984507_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_overlord_of_the_spice_dominion_1304984507_40.png";
function on_apply(pc){
	
}
var conditions = {
	305 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "all_spice",
		value	: "5003"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 150
	}
};

//log.info("master_overlord_of_the_spice_dominion.js LOADED");

// generated ok (NO DATE)
