var name		= "Dandy Tincturer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Infused 87 Tinctures";
var status_text		= "You squished herbs into their purest (and most alcoholic) tincturous form 87 times.";
var last_published	= 1338918622;
var is_shareworthy	= 0;
var url		= "dandy-tincturer";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/dandy_tincturer_1321576686.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/dandy_tincturer_1321576686_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/dandy_tincturer_1321576686_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/dandy_tincturer_1321576686_40.png";
function on_apply(pc){
	
}
var conditions = {
	639 : {
		type	: "counter",
		group	: "making_tool",
		label	: "tincturing_kit",
		value	: "87"
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
	pc.stats_add_favor_points("ti", round_to_5(125 * multiplier));
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
		"giant"		: "ti",
		"points"	: 125
	}
};

//log.info("dandy_tincturer.js LOADED");

// generated ok (NO DATE)
