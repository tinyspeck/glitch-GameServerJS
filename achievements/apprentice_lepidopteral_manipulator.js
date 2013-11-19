var name		= "Apprentice Lepidopteral Manipulator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Administered 23 adequate Butterfly massages";
var status_text		= "The official massage-o-meter indicates that you've administered 23 enthusiastic, if amateurish, Butterfly massages. You've earned the title of Apprentice Lepidopteral Manipular.";
var last_published	= 1348796722;
var is_shareworthy	= 1;
var url		= "apprentice-lepidopteral-manipulator";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/apprentice_lepidopteral_manipulator_1304984111.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/apprentice_lepidopteral_manipulator_1304984111_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/apprentice_lepidopteral_manipulator_1304984111_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/apprentice_lepidopteral_manipulator_1304984111_40.png";
function on_apply(pc){
	
}
var conditions = {
	236 : {
		type	: "counter",
		group	: "npc_butterfly",
		label	: "massage",
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(15 * multiplier));
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
		"giant"		: "humbaba",
		"points"	: 15
	}
};

//log.info("apprentice_lepidopteral_manipulator.js LOADED");

// generated ok (NO DATE)
