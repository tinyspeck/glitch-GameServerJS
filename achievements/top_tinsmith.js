var name		= "Top Tinsmith";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Lovingly rubbed 501 basic Plain Metal Ingots into superior Tin";
var status_text		= "For outstanding achievement of racing to the top of the Tin-smithery charts, you are hereby awarded the title of Top Tinsmith, with all the honours that entails. P.S. There are no honours.";
var last_published	= 1348802946;
var is_shareworthy	= 1;
var url		= "top-tinsmith";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/top_tinsmith_1315685828.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/top_tinsmith_1315685828_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/top_tinsmith_1315685828_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/top_tinsmith_1315685828_40.png";
function on_apply(pc){
	
}
var conditions = {
	468 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "174",
		value	: "501"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "ti",
		"points"	: 150
	}
};

//log.info("top_tinsmith.js LOADED");

// generated ok (NO DATE)
