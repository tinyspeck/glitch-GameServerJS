var name		= "Really Un-Confounded Compounder";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Cooked up 503 compounds with a Test Tube";
var status_text		= "Hey now! Cooking up 503 compounds is no small task. You've earned every bit of this here Really Un-Confounded Compounder Badge.";
var last_published	= 1317674709;
var is_shareworthy	= 0;
var url		= "really-unconfounded-compounder";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/really_unconfounded_compounder_1316417069.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/really_unconfounded_compounder_1316417069_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/really_unconfounded_compounder_1316417069_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/really_unconfounded_compounder_1316417069_40.png";
function on_apply(pc){
	
}
var conditions = {
	225 : {
		type	: "counter",
		group	: "making_tool",
		label	: "test_tube",
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(30 * multiplier));
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
		"giant"		: "ti",
		"points"	: 30
	}
};

//log.info("really_unconfounded_compounder.js LOADED");

// generated ok (NO DATE)
