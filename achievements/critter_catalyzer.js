var name		= "Critter Catalyzer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used Powder of Startling Fecundity on 5 critters at once.";
var status_text		= "Bravissimo. Using a Powder of Startling Fecundity on five critters at once has made you eligible for the honorary title of Critter Catalyzer.";
var last_published	= 1348797383;
var is_shareworthy	= 1;
var url		= "critter-catalyzer";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/critter_catalyzer_1304984072.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/critter_catalyzer_1304984072_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/critter_catalyzer_1304984072_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/critter_catalyzer_1304984072_40.png";
function on_apply(pc){
	
}
var conditions = {
	229 : {
		type	: "counter",
		group	: "powders",
		label	: "critter_catalyzer",
		value	: "1"
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

//log.info("critter_catalyzer.js LOADED");

// generated ok (NO DATE)
