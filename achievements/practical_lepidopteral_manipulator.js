var name		= "Practical Lepidopteral Manipulator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Administered 41 reasonably competent Butterfly massages";
var status_text		= "You've lovingly eased the kinks out of 41 teeny little Butterfly necks, thereby earning your very own self the title Practical Lepidopteral Manipulator.";
var last_published	= 1348802249;
var is_shareworthy	= 1;
var url		= "practical-lepidopteral-manipulator";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/practical_lepidopteral_manipulator_1304984116.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/practical_lepidopteral_manipulator_1304984116_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/practical_lepidopteral_manipulator_1304984116_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/practical_lepidopteral_manipulator_1304984116_40.png";
function on_apply(pc){
	
}
var conditions = {
	237 : {
		type	: "counter",
		group	: "npc_butterfly",
		label	: "massage",
		value	: "41"
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

//log.info("practical_lepidopteral_manipulator.js LOADED");

// generated ok (NO DATE)
