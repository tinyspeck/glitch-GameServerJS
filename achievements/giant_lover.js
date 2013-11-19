var name		= "Giant Lover";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Created an icon for every Giant";
var status_text		= "To show one Giant enough love for a single Emblem is good. To show enough love to one Giant for an Icon is great. But to show all eleven Giants enough love to make eleven Icons? Well, that's frankly remarkable. YOU are remarkable, Giant Lover.";
var last_published	= 1348798787;
var is_shareworthy	= 1;
var url		= "giant-lover";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-05\/giant_lover_1323112383.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-05\/giant_lover_1323112383_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-05\/giant_lover_1323112383_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-05\/giant_lover_1323112383_40.png";
function on_apply(pc){
	
}
var conditions = {
	656 : {
		type	: "group_count",
		group	: "VERB:iconize",
		value	: "11"
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
	pc.stats_add_xp(round_to_5(1111 * multiplier), true);
	pc.metabolics_add_mood(round_to_5(555 * multiplier));
	pc.metabolics_add_energy(round_to_5(555 * multiplier));
	pc.stats_add_favor_points("all", round_to_5(111 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 1111,
	"mood"		: 555,
	"energy"	: 555,
	"favor"		: {
		"giant"		: "all",
		"points"	: 111
	}
};

//log.info("giant_lover.js LOADED");

// generated ok (NO DATE)
