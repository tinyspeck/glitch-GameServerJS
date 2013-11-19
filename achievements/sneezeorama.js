var name		= "Sneeze-O-Rama";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Made five other players sneeze simultaneously with Sneezing Powder";
var status_text		= "Atchoo! Hey, watch it with that stuff. You've just earned a Sneeze-O-Rama badge for making five players sneeze at once with your Sneezing Powder.";
var last_published	= 1348802845;
var is_shareworthy	= 1;
var url		= "sneezeorama";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/sneezeorama_1304984068.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/sneezeorama_1304984068_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/sneezeorama_1304984068_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/sneezeorama_1304984068_40.png";
function on_apply(pc){
	
}
var conditions = {
	228 : {
		type	: "counter",
		group	: "powders",
		label	: "sneezeorama",
		value	: "1"
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
	pc.stats_add_favor_points("friendly", round_to_5(10 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 10
	}
};

//log.info("sneezeorama.js LOADED");

// generated ok (NO DATE)
