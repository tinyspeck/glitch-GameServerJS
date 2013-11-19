var name		= "Pork Petter Extraordinaire";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Petted 137 Piggies.";
var status_text		= "Heavy petting should never go unrewarded. That's why, for petting 137 Piggies, you are now considered a Pork Petter Extraordinaire.";
var last_published	= 1348802238;
var is_shareworthy	= 1;
var url		= "pork-petter-extraordinaire";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pork_petter_extraordinaire_1304984236.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pork_petter_extraordinaire_1304984236_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pork_petter_extraordinaire_1304984236_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/pork_petter_extraordinaire_1304984236_40.png";
function on_apply(pc){
	
}
var conditions = {
	255 : {
		type	: "counter",
		group	: "npc_piggy",
		label	: "pet",
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

//log.info("pork_petter_extraordinaire.js LOADED");

// generated ok (NO DATE)
