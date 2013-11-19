var name		= "Incubator Par Egg-cellence";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Incubated 103 Eggs, with some help from a Chicken";
var status_text		= "Wow! That makes 103 Eggs you've hatched, without spilling a single drop of yolk. You deserve the title of Incubator Par Egg-cellence.";
var last_published	= 1348799187;
var is_shareworthy	= 1;
var url		= "incubator-par-eggcellence";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/incubator_par_eggcellence_1304984165.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/incubator_par_eggcellence_1304984165_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/incubator_par_eggcellence_1304984165_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/incubator_par_eggcellence_1304984165_40.png";
function on_apply(pc){
	
}
var conditions = {
	245 : {
		type	: "group_sum",
		group	: "eggs_incubated",
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(150 * multiplier));
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
		"giant"		: "humbaba",
		"points"	: 150
	}
};

//log.info("incubator_par_eggcellence.js LOADED");

// generated ok (NO DATE)
