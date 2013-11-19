var name		= "Severus Sash";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Charmed 457 Potions into being";
var status_text		= "Time was, someone with the dedication to make 457 Potions would have been awarded an actual Serverus Sash, named for some Master of Potions or other. But so what? You got this awesome badge!";
var last_published	= 1348802540;
var is_shareworthy	= 1;
var url		= "severus-sash";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/severus_sash_1322093717.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/severus_sash_1322093717_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/severus_sash_1322093717_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/severus_sash_1322093717_40.png";
function on_apply(pc){
	
}
var conditions = {
	648 : {
		type	: "counter",
		group	: "making_tool",
		label	: "cauldron",
		value	: "457"
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

//log.info("severus_sash.js LOADED");

// generated ok (NO DATE)
