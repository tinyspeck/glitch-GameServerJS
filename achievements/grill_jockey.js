var name		= "Grill Jockey";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Delicately charred 23 dishes with a Famous Pugilist Grill.";
var status_text		= "Turn up the heat! You've won the title of Grill Jockey.";
var last_published	= 1317768545;
var is_shareworthy	= 0;
var url		= "grill-jockey";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/grill_jockey_1304983415.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/grill_jockey_1304983415_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/grill_jockey_1304983415_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/grill_jockey_1304983415_40.png";
function on_apply(pc){
	
}
var conditions = {
	33 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "mike_tyson_grill",
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 20
	}
};

//log.info("grill_jockey.js LOADED");

// generated ok (NO DATE)
