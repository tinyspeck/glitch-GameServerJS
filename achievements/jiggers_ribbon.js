var name		= "Jigger's Ribbon";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Toiled over 199 Potions";
var status_text		= "A badge named after the ribbon awarded to 'A. Jigger' who listed the staggering number of potions he made (199 in all) in his Potion Opuscule (some kind of book). Hey! 199 Potions! Thats just like you!";
var last_published	= 1348801449;
var is_shareworthy	= 1;
var url		= "jiggers-ribbon";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/jiggers_ribbon_1322093715.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/jiggers_ribbon_1322093715_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/jiggers_ribbon_1322093715_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-23\/jiggers_ribbon_1322093715_40.png";
function on_apply(pc){
	
}
var conditions = {
	647 : {
		type	: "counter",
		group	: "making_tool",
		label	: "cauldron",
		value	: "199"
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "ti",
		"points"	: 60
	}
};

//log.info("jiggers_ribbon.js LOADED");

// generated ok (NO DATE)
