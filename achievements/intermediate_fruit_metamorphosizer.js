var name		= "Intermediate Fruit Metamorphosizer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Converted 503 Fruit";
var status_text		= "One thing is for sure: all the Cherries you've converted will never be the same. You may now brag to your friends that you are an Intermediate Fruit Metamorphosizer";
var last_published	= 1339620707;
var is_shareworthy	= 0;
var url		= "intermediate-fruit-metamorphosizer";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/intermediate_fruit_metamorphosizer_1304984319.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/intermediate_fruit_metamorphosizer_1304984319_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/intermediate_fruit_metamorphosizer_1304984319_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/intermediate_fruit_metamorphosizer_1304984319_40.png";
function on_apply(pc){
	
}
var conditions = {
	272 : {
		type	: "counter",
		group	: "making_tool",
		label	: "fruit_changing_machine",
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(125 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 125
	}
};

//log.info("intermediate_fruit_metamorphosizer.js LOADED");

// generated ok (NO DATE)
