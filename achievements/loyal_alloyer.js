var name		= "Loyal Alloyer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Stewed 5011 compounds with a Test Tube";
var status_text		= "Whoa there. That Test Tube cannot take much more concocting. Give that thing a break and enjoy your shiny new Loyal Alloyer badge.";
var last_published	= 1348801522;
var is_shareworthy	= 1;
var url		= "loyal-alloyer";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/loyal_alloyer_1316417071.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/loyal_alloyer_1316417071_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/loyal_alloyer_1316417071_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/loyal_alloyer_1316417071_40.png";
function on_apply(pc){
	
}
var conditions = {
	226 : {
		type	: "counter",
		group	: "making_tool",
		label	: "test_tube",
		value	: "5011"
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
	pc.stats_add_favor_points("ti", round_to_5(50 * multiplier));
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
		"giant"		: "ti",
		"points"	: 50
	}
};

//log.info("loyal_alloyer.js LOADED");

// generated ok (NO DATE)
