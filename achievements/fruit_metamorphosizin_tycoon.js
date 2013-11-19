var name		= "Fruit Metamorphosizin' Tycoon";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Converted 2003 Fruit";
var status_text		= "If there was a prize for converting this many fruit, you would deserve it. Oh wait... there is! It's the badge for being a Fruit Metamorphosizin' Tycoon.";
var last_published	= 1348798490;
var is_shareworthy	= 1;
var url		= "fruit-metamorphosizin-tycoon";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fruit_metamorphosizin_tycoon_1304984363.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fruit_metamorphosizin_tycoon_1304984363_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fruit_metamorphosizin_tycoon_1304984363_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fruit_metamorphosizin_tycoon_1304984363_40.png";
function on_apply(pc){
	
}
var conditions = {
	280 : {
		type	: "counter",
		group	: "making_tool",
		label	: "fruit_changing_machine",
		value	: "2003"
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(175 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 175
	}
};

//log.info("fruit_metamorphosizin_tycoon.js LOADED");

// generated ok (NO DATE)
