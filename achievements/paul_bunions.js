var name		= "Paul Bunions";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Hatchet to clear 1009 dead Trees";
var status_text		= "This marks the 1009th tree you've transmogrified to a plankier state, earning your very own self the title Paul Bunions.";
var last_published	= 1348802206;
var is_shareworthy	= 1;
var url		= "paul-bunions";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/paul_bunions_1304984280.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/paul_bunions_1304984280_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/paul_bunions_1304984280_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/paul_bunions_1304984280_40.png";
function on_apply(pc){
	
}
var conditions = {
	264 : {
		type	: "group_sum",
		group	: "dead_trants_cleared",
		value	: "1009"
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
	pc.stats_add_favor_points("mab", round_to_5(150 * multiplier));
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
		"giant"		: "mab",
		"points"	: 150
	}
};

//log.info("paul_bunions.js LOADED");

// generated ok (NO DATE)
