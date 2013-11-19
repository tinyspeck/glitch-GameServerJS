var name		= "Protein Time!!!";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Chowed down 11 raw meats";
var status_text		= "Glurk. That was your eleventh raw meat. You've earned a Protein Time badge.";
var last_published	= 1338926811;
var is_shareworthy	= 0;
var url		= "protein-time";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/protein_time_1304983792.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/protein_time_1304983792_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/protein_time_1304983792_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/protein_time_1304983792_40.png";
function on_apply(pc){
	
}
var conditions = {
	626 : {
		type	: "counter",
		group	: "items_eaten",
		label	: "meat",
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 10
	}
};

//log.info("protein_time.js LOADED");

// generated ok (NO DATE)
