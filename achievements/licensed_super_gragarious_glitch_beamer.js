var name		= "Licensed Super-Gregarious Glitch-Beamer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Somehow convinced 11 or more foolhardy souls to follow on 13 teleports";
var status_text		= "Congratulations! By convincing 11 fellow travellers on the cosmic road to teleport with you a full 13 times, you've finally gained your metaphorical teleportation licence. Technically, you don't actually need a license to teleport, but doesn't having one make you feel special?";
var last_published	= 1348801500;
var is_shareworthy	= 1;
var url		= "licensed-super-gragarious-glitch-beamer";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licensed_super_gragarious_glitch_beamer_1315686109.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licensed_super_gragarious_glitch_beamer_1315686109_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licensed_super_gragarious_glitch_beamer_1315686109_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/licensed_super_gragarious_glitch_beamer_1315686109_40.png";
function on_apply(pc){
	
}
var conditions = {
	563 : {
		type	: "group_sum",
		group	: "teleportation_self_withfollowers_11",
		value	: "13"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 100
	}
};

//log.info("licensed_super_gragarious_glitch_beamer.js LOADED");

// generated ok (NO DATE)
