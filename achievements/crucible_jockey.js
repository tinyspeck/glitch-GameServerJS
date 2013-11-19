var name		= "Crucible Jockey";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Smelted 127 Metal Ingots from purest Metal Rock";
var status_text		= "Consider the crucible. A metaphor for the soul-defining crises of the Glitchian experience? Or merely the first word of a somewhat cool-sounding badge name? Or possibly both!";
var last_published	= 1323921408;
var is_shareworthy	= 0;
var url		= "crucible-jockey";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/crucible_jockey_1315686076.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/crucible_jockey_1315686076_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/crucible_jockey_1315686076_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/crucible_jockey_1315686076_40.png";
function on_apply(pc){
	
}
var conditions = {
	549 : {
		type	: "counter",
		group	: "smelter",
		label	: "ingots_created",
		value	: "127"
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(30 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 30
	}
};

//log.info("crucible_jockey.js LOADED");

// generated ok (NO DATE)
