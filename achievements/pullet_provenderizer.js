var name		= "Pullet Provenderizer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Nourished 23 Chicks to squawky adulthood";
var status_text		= "You've nourished 23 hungry, hungry Chicks to squawky, squawky Chickenhood. For this, you're earned the honorary title Pullet Provenderizer.";
var last_published	= 1316304165;
var is_shareworthy	= 0;
var url		= "pullet-provenderizer";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pullet_provenderizer_1304984189.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pullet_provenderizer_1304984189_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pullet_provenderizer_1304984189_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pullet_provenderizer_1304984189_40.png";
function on_apply(pc){
	
}
var conditions = {
	250 : {
		type	: "counter",
		group	: "animals_grown",
		label	: "chick",
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

//log.info("pullet_provenderizer.js LOADED");

// generated ok (NO DATE)
