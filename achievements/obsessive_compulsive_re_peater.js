var name		= "Obsessive-Compulsive Re-Peater";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 503 slightly funky Blocks of Peat";
var status_text		= "To some, Blocks of Peat are mere resources necessary for the construction of useful things. For others, they are secret objects of obsessive desire. We're not saying which camp you fall into when we dub you Obsessive-Compulsive Re-Peater. Just making a suggestion.";
var last_published	= 1348801958;
var is_shareworthy	= 1;
var url		= "obsessive-compulsive-re-peater";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/obsessive_compulsive_re_peater_1315686010.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/obsessive_compulsive_re_peater_1315686010_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/obsessive_compulsive_re_peater_1315686010_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/obsessive_compulsive_re_peater_1315686010_40.png";
function on_apply(pc){
	
}
var conditions = {
	525 : {
		type	: "counter",
		group	: "completed_harvest",
		label	: "peat_bog",
		value	: "503"
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 60
	}
};

//log.info("obsessive_compulsive_re_peater.js LOADED");

// generated ok (NO DATE)
