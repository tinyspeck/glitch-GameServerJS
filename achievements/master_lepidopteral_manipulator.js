var name		= "Master Lepidopteral Manipulator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Administered 137 fairly awesome Butterfly massages";
var status_text		= "That makes 137 Butterflies you've authoritatively kneaded into momentary submission. Revel in your power! And enjoy your newly earned title of Master Lepidopteral Manipulator.";
var last_published	= 1348801849;
var is_shareworthy	= 1;
var url		= "master-lepidopteral-manipulator";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_lepidopteral_manipulator_1304984121.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_lepidopteral_manipulator_1304984121_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_lepidopteral_manipulator_1304984121_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/master_lepidopteral_manipulator_1304984121_40.png";
function on_apply(pc){
	
}
var conditions = {
	238 : {
		type	: "counter",
		group	: "npc_butterfly",
		label	: "massage",
		value	: "137"
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 50
	}
};

//log.info("master_lepidopteral_manipulator.js LOADED");

// generated ok (NO DATE)
