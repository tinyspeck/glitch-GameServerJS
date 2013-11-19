var name		= "Intermediate Larva Lover";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Fed 23 Caterpillars until they metamorphosized into Butterflies";
var status_text		= "That makes 23 Caterpillars who would never have matured into milk-giving adulthood without you. You deserve the title Intermediate Larva Lover, and all the honors that title entails.";
var last_published	= 1338918929;
var is_shareworthy	= 0;
var url		= "intermediate-larva-lover";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/intermediate_larva_lover_1304984136.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/intermediate_larva_lover_1304984136_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/intermediate_larva_lover_1304984136_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/intermediate_larva_lover_1304984136_40.png";
function on_apply(pc){
	
}
var conditions = {
	241 : {
		type	: "counter",
		group	: "animals_grown",
		label	: "caterpillar",
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(25 * multiplier));
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
		"giant"		: "humbaba",
		"points"	: 25
	}
};

//log.info("intermediate_larva_lover.js LOADED");

// generated ok (NO DATE)
